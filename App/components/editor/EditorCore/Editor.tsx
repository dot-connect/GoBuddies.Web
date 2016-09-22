/// <reference path="../draftExt.d.ts" />

import * as React from "react";
import {
  Editor,
  EditorState,
  ContentState,
  CompositeDecorator,
  Entity,
  Modifier,
  getDefaultKeyBinding,
  KeyBindingUtil,
  DefaultDraftBlockRenderMap,
  DraftBlockRenderConfig
} from "draft-js";

import { objectAssign } from "object-assign";
import { List, Map } from "immutable";
import { createToolbar } from "../Toolbar";
import ConfigStore from "./ConfigStore";
import GetHTML from "./export/getHTML";
import exportText, { decodeContent } from "./export/exportText";
import { Plugin } from "../interface"

const { hasCommandModifier } = KeyBindingUtil;

function noop(): void {};

export interface EditorProps extends React.Props<EditorCore> {
  multiLines: boolean;
  plugins?: Array<Plugin>;
  pluginConfig?: Object;
  prefixCls?: string;
  onChange?: (editorState: EditorState) => EditorState;
  toolbars?: Array<any>;
  splitLine?: String;
  onKeyDown?: (ev: any) => boolean;
  defaultValue?: EditorState;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  style?: Object;
  value?: EditorState | any;
}

export interface EditorCoreState {
  editorState?: EditorState;
  customStyleMap?: Object;
  customBlockStyleMap?: Object;
  blockRenderMap?: Map<String, DraftBlockRenderConfig>;
  toolbarPlugins?: List<Plugin>;
  plugins?: Array<Plugin>;
  compositeDecorator?: CompositeDecorator;
}


const toolbar = createToolbar();
const configStore: ConfigStore = new ConfigStore();

export class EditorCore extends React.Component<EditorProps, EditorCoreState> {
  
    static ToEditorState(text: string): EditorState {
        const createEmptyContentState = ContentState.createFromText(decodeContent(text) || "");
        const editorState = EditorState.createWithContent(createEmptyContentState);
        return EditorState.forceSelection(editorState, createEmptyContentState.getSelectionAfter());
    }

  public static GetText = exportText;

  public static GetHTML = GetHTML(configStore);
  public Reset(): void {
    this.setEditorState(
      EditorState.push(this.state.editorState, this.props.defaultValue.getCurrentContent(), "reset-editor")
    );
  }

  public SetText(text: string) : void {
    const createTextContentState = ContentState.createFromText(text || "");
    const editorState = EditorState.push(this.state.editorState, createTextContentState, "editor-setText");
    this.setEditorState(
      EditorState.moveFocusToEnd(editorState)
    , true);
  }

  public state : EditorCoreState;
  private plugins: any;
  private controlledMode: boolean;

  constructor(props: EditorProps) {
    super(props);
    this.plugins = List(List(props.plugins).flatten(true));

    let editorState;

    if (props.value !== undefined) {
      if (props.value instanceof EditorState) {
        editorState = props.value || EditorState.createEmpty();
      } else {
        editorState = EditorState.createEmpty();
      }
    } else {
      editorState = EditorState.createEmpty();
    }

    editorState = this.generatorDefaultValue(editorState);

    this.state = {
      plugins: this.reloadPlugins(),
      editorState: editorState,
      customStyleMap: {},
      customBlockStyleMap: {},
      compositeDecorator: null,
    };

    if (props.value !== undefined) {
      this.controlledMode = true;
      console.warn("this component is in controllred mode");
    }
  }

  refs: {
    [string: string]: any;
    editor?: any;
  };

  public static defaultProps = {
    multiLines: true,
    plugins: [],
    prefixCls: "rc-editor-core",
    pluginConfig: {},
    toolbars: [],
    spilitLine: "enter",
  };
  
  public reloadPlugins(): Array<Plugin> {
    return this.plugins && this.plugins.size ? this.plugins.map((plugin : Plugin) => {
      // 　如果插件有 callbacks 方法,则认为插件已经加载。
      if (plugin.callbacks) {
        return plugin;
      }
      // 如果插件有 constructor 方法,则构造插件
      if (plugin.hasOwnProperty("constructor")) {
        const pluginConfig = objectAssign(this.props.pluginConfig, plugin.config);
        return plugin.constructor(pluginConfig);
      }
      // else 无效插件
      console.warn(">> 插件: [", plugin.name , "] 无效。插件或许已经过期。");
      return false;
    }).filter(plugin => plugin).toArray() : [];
  }

  public componentWillMount() : void {
    const plugins = this.initPlugins().concat([toolbar]);
    const customStyleMap = {};
    const customBlockStyleMap = {};

    let customBlockRenderMap: Map<String, DraftBlockRenderConfig> = Map(DefaultDraftBlockRenderMap);

    // initialize compositeDecorator
    const compositeDecorator = new CompositeDecorator(
      plugins.filter(plugin => plugin.decorators !== undefined)
        .map(plugin => plugin.decorators)
        .reduce((prev, curr) => prev.concat(curr), [])
    );

    // initialize Toolbar
    const toolbarPlugins = List(plugins.filter(plugin => !!plugin.component && plugin.name !== "toolbar"));

    // load inline styles...
    plugins.forEach( plugin => {
      const { styleMap, blockStyleMap, blockRenderMap } = plugin;
      if (styleMap) {
        for (const key in styleMap) {
          if (styleMap.hasOwnProperty(key)) {
            customStyleMap[key] = styleMap[key];
          }
        }
      }
      if (blockStyleMap) {
        for (const key in blockStyleMap) {
          if (blockStyleMap.hasOwnProperty(key)) {
            customBlockStyleMap[key] = blockStyleMap[key];
            customBlockRenderMap = customBlockRenderMap.set(key, {
              element: null,
            });
          }
        }
      }

      if (blockRenderMap) {
        for (const key in blockRenderMap) {
          if (blockRenderMap.hasOwnProperty(key)) {
            customBlockRenderMap = customBlockRenderMap.set(key, blockRenderMap[key]);
          }
        }
      }
    });
    configStore.set("customStyleMap", customStyleMap);
    configStore.set("customBlockStyleMap", customBlockStyleMap);
    configStore.set("blockRenderMap", customBlockRenderMap);
    configStore.set("customStyleFn", this.customStyleFn.bind(this));

    this.setState({
      toolbarPlugins,
      compositeDecorator,
    });

    this.setEditorState(EditorState.set(this.state.editorState,
      { decorator: compositeDecorator }
    ));

  }
  public componentWillReceiveProps(nextProps) {
    if (this.controlledMode) {
      const decorators = nextProps.value.getDecorator();

      const editorState = decorators ?
        nextProps.value :
        EditorState.set(nextProps.value,
          { decorator: this.state.compositeDecorator }
        );
      this.setState({
        editorState,
      });
    }
  }
  //  处理　value　
  generatorDefaultValue(editorState: EditorState): EditorState {
    const { defaultValue } = this.props;
    if (defaultValue) {
      return defaultValue;
    }
    return editorState;
  }

  public getStyleMap(): Object {
    return configStore.get("customStyleMap");
  }
  public setStyleMap(customStyleMap): void {
    configStore.set("customStyleMap", customStyleMap);
    this.render();
  }

  public initPlugins() : Array<any> {
    const enableCallbacks = ["getEditorState", "setEditorState", "getStyleMap", "setStyleMap"];
    return this.getPlugins().map(plugin => {
      enableCallbacks.forEach( callbackName => {
        if (plugin.callbacks.hasOwnProperty(callbackName)) {
          plugin.callbacks[callbackName] = this[callbackName].bind(this);
        }
      });

      return plugin;
    });
  }

  public focus() : void {
    this.refs.editor.focus();
  }

  public getPlugins(): Array<Plugin> {
    return this.state.plugins.slice();
  }

  public getEventHandler(): Object {
    const enabledEvents = ["onUpArrow", "onDownArrow", "handleReturn", "onFocus", "onBlur"];
    const eventHandler = {};
    enabledEvents.forEach(event => {
      eventHandler[event] = this.generatorEventHandler(event);
    });
    return eventHandler;
  }

  getEditorState() : EditorState {
    return this.state.editorState;
  }

  setEditorState(editorState: EditorState, focusEditor: boolean = false) : void {
    let newEditorState = editorState;

    this.getPlugins().forEach(plugin => {
      if (plugin.onChange) {
        const updatedEditorState = plugin.onChange(newEditorState);
        if (updatedEditorState) {
          newEditorState = updatedEditorState;
        }
      }
    });

    if (this.props.onChange) {
      this.props.onChange(newEditorState);
    }
    if (!this.controlledMode) {
      this.setState({ editorState: newEditorState }, focusEditor ? () => setTimeout(() => this.refs.editor.focus(), 100) : noop);
    }
  }

  public handleKeyBinding(ev: React.KeyboardEvent): any {
    if (this.props.onKeyDown) {
      ev.ctrlKey = hasCommandModifier(ev);
      const keyDownResult = this.props.onKeyDown(ev);
      if (keyDownResult) {
        return keyDownResult;
      }

      return getDefaultKeyBinding(ev);
    }

    return getDefaultKeyBinding(ev);
  }

  public handleKeyCommand(command: String): boolean {
    if (this.props.multiLines) {
      return this.eventHandle("handleKeyBinding", command);
    }

    return command === "split-block";
  }

  public getBlockStyle(contentBlock): String {
    const customBlockStyleMap = configStore.get("customBlockStyleMap");
    const type = contentBlock.getType();
    if (customBlockStyleMap.hasOwnProperty(type)) {
      return customBlockStyleMap[type];
    }
  }

  eventHandle(eventName, ...args) : boolean {
    const plugins = this.getPlugins();
    for (let i = 0; i < plugins.length; i++) {
      const plugin = plugins[i];
      // console.log('>> plugin', plugin);
      if (plugin.callbacks[eventName]
        && typeof plugin.callbacks[eventName] === "function") {
        const result = plugin.callbacks[eventName](...args);
        if (result === true) {
          return true;
        }
      }
    }
    return this.props.hasOwnProperty(eventName) && this.props[eventName](...args) === true ;
  }

  generatorEventHandler(eventName) : Function {
    return (...args) => {
      return this.eventHandle(eventName, ...args);
    };
  }
  customStyleFn(styleSet) : Object {
    if (styleSet.size === 0) {
      return {};
    }

    const plugins = this.getPlugins();
    const resultStyle = {};
    for (let i = 0; i < plugins.length; i++) {
      if (plugins[i].customStyleFn) {
        const styled = plugins[i].customStyleFn(styleSet);
        if (styled) {
          objectAssign(resultStyle, styled);
        }
      }
    }
    return resultStyle;
  }
  render() {
    const { prefixCls, toolbars, style } = this.props;
    const { editorState, toolbarPlugins } = this.state;
    const customStyleMap = configStore.get("customStyleMap");
    const blockRenderMap = configStore.get("blockRenderMap");
    const eventHandler = this.getEventHandler();
    const Toolbar = toolbar.component;
    return (<div
      style={style}
      className={`${prefixCls}-editor`}
      onClick={this.focus.bind(this)}
    >
     
      <div className={`${prefixCls}-editor-wrapper`}  style={style}>
        <Editor
          {...this.props}
          {...eventHandler}
          ref="editor"
          customStyleMap={customStyleMap}
          editorState={editorState}
          handleKeyCommand={this.handleKeyCommand.bind(this)}
          keyBindingFn={this.handleKeyBinding.bind(this)}
          onChange={this.setEditorState.bind(this)}
          blockStyleFn={this.getBlockStyle.bind(this)}
          blockRenderMap={blockRenderMap}
        />
        {this.props.children}
      </div>
    </div>);
  }
}
