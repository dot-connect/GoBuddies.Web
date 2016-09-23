/// <reference path="../../../../typings/index.d.ts"/>

import { EditorCore } from "../EditorCore/Editor";
import { EditorState, ContentState, SelectionState, ContentBlock } from "draft-js";
import { OrderedMap } from "immutable";

import TextProvider from "./text-provider";
import HtmlProvider from "./html-provider";

export class EditorService {
    private textProvider: TextProvider;
    private htmlProvider: HtmlProvider;

    constructor() {
        this.textProvider = new TextProvider();
    }

    public ToEditorState(text: string): EditorState {
        var createEmptyContentState: ContentState = ContentState.createFromText(this.textProvider.decodeContent(text) || "");
        var editorState: EditorState = EditorState.createWithContent(createEmptyContentState);
        return EditorState.forceSelection(editorState, createEmptyContentState.getSelectionAfter());
    }

    public getText(editor: EditorCore, encode: boolean): string {
        return this.textProvider.export(editor, encode);
    }

    public getHtml(editor: EditorCore, encode: boolean): string {
        return this.htmlProvider.export(editor, encode);
    }

    public getTextSelection(editor: EditorCore, blockDelimiter?: string) {
        blockDelimiter = blockDelimiter || "\n";
        var selection: SelectionState = editor.state.editorState.getSelection();
        var startKey: string = selection.getStartKey();
        var endKey: string = selection.getEndKey();

        var contentState: ContentState = editor.state.editorState.getCurrentContent();
        var blocks: OrderedMap<string, ContentBlock> = contentState.getBlockMap();

        var lastWasEnd: boolean = false;
        var selectedBlock: OrderedMap<string, ContentBlock> = blocks
            .skipUntil(function (block: ContentBlock) {
                return block.getKey() === startKey;
            })
            .takeUntil(function (block: ContentBlock) {
                var result: boolean = lastWasEnd;

                if (block.getKey() === endKey) {
                    lastWasEnd = true;
                }

                return result;
            });

        return selectedBlock
            .map(function (block: ContentBlock) {
                var key: string = block.getKey();
                var text: string = block.getText();

                var start: number = 0;
                var end: number = text.length;

                if (key === startKey) {
                    start = selection.getStartOffset();
                }
                if (key === endKey) {
                    end = selection.getEndOffset();
                }

                text = text.slice(start, end);
                return text;
            })
            .join(blockDelimiter);
    }
}