/// <reference path="../draftExt.d.ts" />

import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as Rx from 'rxjs';
import {
  Editor,
  EditorState,
  ContentState,
  CompositeDecorator,
  getDefaultKeyBinding,
  KeyBindingUtil,
  DefaultDraftBlockRenderMap,
  DraftBlockRenderConfig,
  ContentBlock,
  SelectionState
} from 'draft-js';

import Paper from 'material-ui/Paper';
import Popover from 'material-ui/Popover/Popover';

import { objectAssign } from 'object-assign';
import { List, Map } from 'immutable';

import { createToolbar } from '../Toolbar';
import { ConfigStore } from './ConfigStore';
import { Plugin } from '../interface';
import { EditorService, UiService } from '../services';
import { MiniToolBar } from './mini-toolbar';
import * as Commands from '../commands';

const { hasCommandModifier } = KeyBindingUtil;

function noop(): void { };

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
  currentCursorBound?: ClientRect;
  miniToolbarOpen?: boolean;
  commands?: React.ReactNode;
}

const toolbar = createToolbar();

export class EditorCore extends React.Component<EditorProps, EditorCoreState> {

  public state: EditorCoreState;
  public configStore: ConfigStore = new ConfigStore();
  public controls: {
    editorContainer?: HTMLDivElement;
    editor?: Editor;
    miniToolBar?: MiniToolBar
  };
  public miniToolBarOpen: Rx.BehaviorSubject<boolean>;

  private manager: EditorService;
  private uiService: UiService;
  private plugins: List<Plugin>;
  private controlledMode: boolean;

  private editorContainerMouseUpStream: Rx.Subscription;
  private editorContainerClickStream: Rx.Subscription;
  private editorContainerDoubleClickStream: Rx.Subscription;
  private miniToolBarOpenStream: Rx.Subscription;

  constructor(props: EditorProps) {
    super(props);

    this.manager = new EditorService(this);
    this.uiService = new UiService(this.manager);
    this.controls = {};

    // this.plugins = List(List(props.plugins).flatten(true));

    let editorState: EditorState = null;
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
      // plugins: this.reloadPlugins(),
      editorState: editorState,
      customStyleMap: {},
      customBlockStyleMap: {},
      compositeDecorator: null,
      miniToolbarOpen: false
    };

    if (props.value !== undefined) {
      this.controlledMode = true;
      console.warn('this component is in controllred mode');
    }
  }

  handleKeyCommand = (command: String): boolean => {
    // if (this.props.multiLines) {
    //   return this.eventHandle('handleKeyBinding', command);
    // }

    return command === 'split-block';
  }

  handleKeyBinding = (ev: React.KeyboardEvent): any => {
    // if (this.props.onKeyDown) {
    //   ev.ctrlKey = hasCommandModifier(ev);
    //   const keyDownResult = this.props.onKeyDown(ev);
    //   if (keyDownResult) {
    //     return keyDownResult;
    //   }

    //   return getDefaultKeyBinding(ev);
    // }

    return getDefaultKeyBinding(ev);
  }

  setEditorState = (editorState: EditorState, focusEditor: boolean = false): void => {
    let newEditorState: EditorState = editorState;

    // this.getPlugins().forEach(plugin => {
    //   if (plugin.onChange) {
    //     const updatedEditorState: EditorState = plugin.onChange(newEditorState);
    //     if (updatedEditorState) {
    //       newEditorState = updatedEditorState;
    //     }
    //   }
    // });

    if (this.props.onChange) {
      this.props.onChange(newEditorState);
    }
    if (!this.controlledMode) {
      this.setState({ editorState: newEditorState }, focusEditor ? () => setTimeout(() => this.controls.editor.focus(), 100) : noop);
    }
  }

  getBlockStyle = (contentBlock: ContentBlock): string => {
    const customBlockStyleMap = this.configStore.get('customBlockStyleMap');
    const type = contentBlock.getType();
    if (customBlockStyleMap.hasOwnProperty(type)) {
      return customBlockStyleMap[type];
    }
  }

  onMiniToolBarRequestClose = (reason: string): void => {
    this.setState({ currentCursorBound: null });
    this.miniToolBarOpen.next(false);
  }

  public getEditorState(text: string): EditorState {
    return this.manager.toEditorState(text);
  }

  public getText(encode: boolean = false): string {
    return this.manager.getText(this.state.editorState, encode);
  }

  public getHtml(encode: boolean = false): string {
    return this.manager.getHtml(this.state.editorState, encode);
  }

  public Reset(): void {
    this.setEditorState(
      EditorState.push(this.state.editorState, this.props.defaultValue.getCurrentContent(), 'reset-editor')
    );
  }

  public SetText(text: string): void {
    const createTextContentState = ContentState.createFromText(text || '');
    const editorState = EditorState.push(this.state.editorState, createTextContentState, 'editor-setText');
    this.setEditorState(
      EditorState.moveFocusToEnd(editorState)
      , true);
  }

  // public static defaultProps = {
  //   multiLines: true,
  //   plugins: [],
  //   prefixCls: "rc-editor-core",
  //   pluginConfig: {},
  //   toolbars: [],
  //   spilitLine: "enter",
  // };

  // public reloadPlugins(): Array<Plugin> {
  //   return this.plugins && this.plugins.size ? this.plugins.map((plugin: Plugin) => {
  //     if (plugin.callbacks) {
  //       return plugin;
  //     }

  //     if (plugin.hasOwnProperty('constructor')) {
  //       const pluginConfig = objectAssign(this.props.pluginConfig, plugin.config);
  //       return plugin.constructor(pluginConfig);
  //     }

  //     console.warn('>> Load Plugin: [', plugin.name, ']');
  //     return false;
  //   }).filter(plugin => plugin).toArray() : [];
  // }

  public componentWillMount(): void {
    // const plugins = this.initPlugins().concat([toolbar]);
    // const plugins: Array<Plugin> = this.initPlugins();
    const customStyleMap = {};
    const customBlockStyleMap = {};

    let customBlockRenderMap: Map<String, DraftBlockRenderConfig> = Map(DefaultDraftBlockRenderMap);

    // Initialize compositeDecorator
    // const compositeDecorator: CompositeDecorator = new CompositeDecorator(
    //   plugins.filter(plugin => plugin.decorators !== undefined)
    //     .map(plugin => plugin.decorators)
    //     .reduce((prev, curr) => prev.concat(curr), [])
    // );

    // Initialize Toolbar
    // const toolbarPlugins: List<Plugin> = List<Plugin>(plugins.filter(plugin => !!plugin.component && plugin.name !== 'toolbar'));

    // this.configStore.set('customStyleMap', customStyleMap);
    // this.configStore.set('customBlockStyleMap', customBlockStyleMap);
    // this.configStore.set('blockRenderMap', customBlockRenderMap);
    // this.configStore.set('customStyleFn', this.customStyleFn.bind(this));

    // this.setState({
    //   toolbarPlugins,
    //   compositeDecorator,
    // });

    // this.setEditorState(EditorState.set(this.state.editorState));
    this.miniToolBarOpen = new Rx.BehaviorSubject(false);
  }

  public componentDidMount(): void {
    this.controls.miniToolBar.setUiService(this.uiService);

    this.editorContainerMouseUpStream
      = Rx.Observable.fromEvent(this.controls.editorContainer, 'mouseup')
        .distinctUntilChanged()
        .subscribe(this.onEditorMouseUp.bind(this));

    // let editorContainerClickStream = Rx.Observable.fromEvent(this.controls.editorContainer, 'click');
    this.editorContainerClickStream
      = Rx.Observable.fromEvent(this.controls.editorContainer, 'click')
        .distinctUntilChanged()
        .subscribe(this.onEditorFocus.bind(this));

    // this.editorContainerDoubleClick = editorContainerClickStream
    //                                     .buffer(editorContainerClickStream.debounceTime(250))
    //                                     .map(list => list.length)
    //                                     .filter(x => x === 2)
    //                                     .subscribe(this.onEditorDoubleClick.bind(this));
    this.editorContainerDoubleClickStream
      = Rx.Observable.fromEvent(this.controls.editorContainer, 'dblclick')
        .distinctUntilChanged()
        .subscribe(this.onEditorDoubleClick.bind(this));
    this.miniToolBarOpenStream
      = this.miniToolBarOpen
      .distinctUntilChanged().subscribe(this.onMiniToolBarOpenChanged);
  }

  public componentWillUnmount(): void {
    this.editorContainerClickStream.unsubscribe();
    this.editorContainerDoubleClickStream.unsubscribe();
    this.miniToolBarOpenStream.unsubscribe();
    this.miniToolBarOpenStream.unsubscribe();
  }

  public componentWillReceiveProps(nextProps: EditorProps) {
    if (this.controlledMode) {
      const decorators = nextProps.value.getDecorator();
      const editorState = decorators
        ? nextProps.value
        : EditorState.set(nextProps.value, { decorator: this.state.compositeDecorator });
      this.setState({
        editorState,
      });
    }
  }

  generatorDefaultValue(editorState: EditorState): EditorState {
    const { defaultValue } = this.props;
    if (defaultValue) {
      return defaultValue;
    }
    return editorState;
  }

//   public getStyleMap(): Object {
//     return this.configStore.get('customStyleMap');
// }
  
//   public setStyleMap(customStyleMap): void {
//     this.configStore.set('customStyleMap', customStyleMap);
//     this.render();
//   }

  // public initPlugins(): Array<Plugin> {
  //   const enableCallbacks: Array<string> = ['getEditorState', 'setEditorState', 'getStyleMap', 'setStyleMap'];
  //   return this.getPlugins().map(plugin => {
  //     enableCallbacks.forEach(callbackName => {
  //       if (plugin.callbacks.hasOwnProperty(callbackName)) {
  //         plugin.callbacks[callbackName] = this[callbackName].bind(this);
  //       }
  //     });

  //     return plugin;
  //   });
  // }

  // public getPlugins(): Array<Plugin> {
  //   return this.state.plugins.slice();
  // }

  // public getEventHandler(): Object {
  //   const enabledEvents = ['onUpArrow', 'onDownArrow', 'handleReturn', 'onFocus', 'onBlur', 'onMouseUp'];
  //   const eventHandler = {};
  //   enabledEvents.forEach(event => {
  //     eventHandler[event] = this.generatorEventHandler(event);
  //   });
  //   return eventHandler;
  // }

  // eventHandle(eventName, ...args): boolean {
  //   const plugins = this.getPlugins();
  //   for (let i = 0; i < plugins.length; i++) {
  //     const plugin = plugins[i];
  //     // console.log('>> plugin', plugin);
  //     if (plugin.callbacks[eventName]
  //       && typeof plugin.callbacks[eventName] === 'function') {
  //       const result = plugin.callbacks[eventName](...args);
  //       if (result === true) {
  //         return true;
  //       }
  //     }
  //   }
  //   return this.props.hasOwnProperty(eventName) && this.props[eventName](...args) === true;
  // }

  // generatorEventHandler(eventName): Function {
  //   return (...args) => {
  //     return this.eventHandle(eventName, ...args);
  //   };
  // }

  // customStyleFn(styleSet): Object {
  //   if (styleSet.size === 0) {
  //     return {};
  //   }

  //   const plugins = this.getPlugins();
  //   const resultStyle = {};
  //   for (let i = 0; i < plugins.length; i++) {
  //     if (plugins[i].customStyleFn) {
  //       const styled = plugins[i].customStyleFn(styleSet);
  //       if (styled) {
  //         objectAssign(resultStyle, styled);
  //       }
  //     }
  //   }
  //   return resultStyle;
  // }

  private onEditorFocus(): void {
    this.controls.editor.focus();
  }

  private onEditorDoubleClick(): void {
    this.state.editorState.getSelection();
    this.setState({ currentCursorBound: this.uiService.getCursorCursorRect() });
    this.miniToolBarOpen.next(true);
  }

  private onEditorMouseUp(): void {
    this.setState({ currentCursorBound: this.uiService.getCursorCursorRect() });
    let selectedText = this.manager.getSelectedText().length;
    if (this.manager.getSelectedText().length !== 0) {
      this.miniToolBarOpen.next(true);
    }
  }

  private onMiniToolBarOpenChanged = (value: boolean) => {
    let contentState = this.state.editorState.getCurrentContent();
    let newState = EditorState.forceSelection(this.state.editorState, contentState.getSelectionAfter());
    this.setState({ miniToolbarOpen: value, editorState: newState });
  }

  render(): JSX.Element {
    const { prefixCls} = this.props;
    // const { editorState } = this.state;
    // const customStyleMap = this.configStore.get('customStyleMap');
    // const blockRenderMap = this.configStore.get('blockRenderMap');
    // const eventHandler = this.getEventHandler();
    return (
      <Paper>
        <div
          className={`${prefixCls}-editor`}
          ref={ref => this.controls.editorContainer = ref}>
          <div className={`${prefixCls}-editor-wrapper`}>
            <Editor
              ref={ref => this.controls.editor = ref}
              editorState={this.state.editorState}
              onChange={this.setEditorState}/>
            {this.props.children}
          </div>
        </div>
        <MiniToolBar ref={ref => this.controls.miniToolBar = ref}
          target={this.state.currentCursorBound}
          open={this.state.miniToolbarOpen}
          onRequestClose={this.onMiniToolBarRequestClose}
          anchorOrigin={{ horizontal: 'middle', vertical: 'top' }}
          targetOrigin={{ horizontal: 'middle', vertical: 'bottom' }}>
        </MiniToolBar>
      </Paper>
    );
  }
}
