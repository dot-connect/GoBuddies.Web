/// <reference path="../../../../typings/index.d.ts"/>

import { EditorState, Entity } from "draft-js";
import { ITextProvider } from "../interface";

export default class TextProvider implements ITextProvider {
    public exportText(editorState: EditorState, encode: boolean): string {
        const content = editorState.getCurrentContent();
        const blockMap = content.getBlockMap();
        return blockMap.map(block => {
            let resultText = "";
            let lastPosition = 0;
            const text = block.getText();
            block.findEntityRanges(function (character) {
                return !!character.getEntity();
            }, function (start, end) {
                var key = block.getEntityAt(start);
                const entityData = Entity.get(key).getData();
                resultText += text.slice(lastPosition, start);
                resultText += entityData && entityData.export ? entityData.export(entityData) : text.slice(start, end);
                lastPosition = end;
            });
            resultText += text.slice(lastPosition);
            return encode ? this.encodeContent(resultText) : resultText;
        }).join(encode ? "<br />\n" : "\n");
    }

    private encodeContent(text: string): string {
        return text
            .split("&").join("&amp;")
            .split("<").join("&lt;")
            .split(">").join("&gt;")
            .split("\xA0").join("&nbsp;")
            .split("\n").join("<br />" + "\n");
    }

    private decodeContent(text: string): string {
        return text.split("<br />" + "\n").join("\n");
    }
}