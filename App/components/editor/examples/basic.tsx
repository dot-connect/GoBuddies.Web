// import "rc-editor-core/assets/index.less";
import EditorCorePublic from "../";
import * as React from "react";
import * as ReactDOM from "react-dom";

// import BasicStyle from "rc-editor-plugin-basic-style";
// import Emoji from "rc-editor-plugin-emoji";
// import "rc-editor-plugin-emoji/assets/index.css";

// const plugins = [BasicStyle, Emoji];
const toolbars = [["bold", "italic", "underline", "strikethrough", "|", "superscript", "subscript", "|", "emoji"]];



const Editor = React.createClass({


    getInitialState() {
        return {
            defaultValue: EditorCorePublic.toEditorState("hello world"),
            value: null,
        };
    },
    keyDown(ev) {
        if (ev.keyCode === 13 && ev.ctrlKey) {
            return "split-block";
        }
    },
    editorChange(editorState) {
        this.setState({
            value: editorState,
        });
    },
    reset() {
        this.setState({
            value: this.state.defaultValue,
        });
    },
    render() {
        return (<div>
            <button onClick={this.reset}> setText </button>
            <EditorCorePublic.EditorCore
                multiLines={true}
                ref="editor"
                onKeyDown={(ev) => this.keyDown(ev).bind(this)}
                onChange={this.editorChange}
                value={this.state.value}
                />
        </div>);
    }
});

export default Editor;