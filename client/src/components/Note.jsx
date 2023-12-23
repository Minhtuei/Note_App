import React, { useEffect, useMemo, useState } from "react";
import {
    ContentState,
    convertFromHTML,
    convertToRaw,
    EditorState,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import { useLoaderData, useSubmit, useLocation } from "react-router-dom";
import { debounce } from "@mui/material";

export default function Note() {
    const { note } = useLoaderData();
    const submit = useSubmit();
    const location = useLocation();
    const [editorState, setEditorState] = useState(() => {
        return EditorState.createEmpty();
    });

    const [rawHTML, setRawHTML] = useState(note.content);

    useEffect(() => {
        const blocksFromHTML = convertFromHTML(note.content);
        const state = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap
        );
        setEditorState(EditorState.createWithContent(state));
    }, [note.id]);

    console.log({ location });

    useEffect(() => {
        debouncedMemorized(rawHTML, note, location.pathname);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rawHTML, location.pathname]);

    const debouncedMemorized = useMemo(() => {
        return debounce((rawHTML, note, pathname) => {
            if (rawHTML === note.content) return;

            submit(
                { ...note, content: rawHTML },
                {
                    method: "post",
                    action: pathname,
                }
            );
        }, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [contentFontSize, setContentFontSize] = useState();
    useEffect(() => {
        setRawHTML(note.content);
        const match = note.content.match(/style=".*?font-size:\s*(\d+)px.*?"/i);
        console.log({ match });
        if (match && match[1]) {
            setContentFontSize(`${match[1]}px`);
        } else {
            // Set default font size based on your preference or application requirement
            const defaultFontSize = "16px"; // Update this value to set the default font size
            setContentFontSize(defaultFontSize);
        }
    }, [note.content]);
    const handleOnChange = (e) => {
        setEditorState(e);
        setRawHTML(draftToHtml(convertToRaw(e.getCurrentContent())));
    };

    return (
        <Editor
            editorState={editorState}
            onEditorStateChange={handleOnChange}
            placeholder="Write something!"
            editorStyle={{
                fontSize: contentFontSize,
                fontFamily: "Times New Roman",
                overflowY: "auto",
                height: "100%",
                padding: "10px",
            }}
        />
    );
}
