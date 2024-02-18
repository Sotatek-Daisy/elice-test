import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import styles from "./index.module.css";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { detectChangeValue, updateFile } from "stores/files/filesSlice";
import { getExtensionFile } from "utils/common";

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

export default function MonacoEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const dispatch = useAppDispatch();
  const filesTree = useAppSelector((state) => state.files.files);
  const isEmptyData = !filesTree || filesTree.length === 0;
  const isChangedFile = useAppSelector((state) => state.files.isChangedFile);
  const fileValue = useAppSelector((state) => state.files.value);
  const fileSelected = useAppSelector((state) => state.files.selectedFileId);

  const supportedLanguages = monaco.languages.getLanguages();

  const setLanguageMode = (
    filename: string
  ) => {
    const fileExtension = getExtensionFile(filename);
    const language = supportedLanguages.find((lang) =>
      lang?.extensions?.includes(`.${fileExtension}`)
    );
    if (language) {
      monaco.editor.setModelLanguage(
        editor?.getModel() as monaco.editor.ITextModel,
        language.id
      );
    } else {
      monaco.editor.setModelLanguage(
        editor?.getModel() as monaco.editor.ITextModel,
        "typescript"
      );
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      setEditor((editor) => {
        if (editor) return editor;

        const monacoEditor = monaco.editor.create(
          editorRef.current as HTMLElement,
          {
            value: fileValue,
            language: "typescript",
          }
        );

        monacoEditor.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
          () => {
            const data = monacoEditor.getValue();
            dispatch(updateFile({ data }));
            alert("Save");
          }
        );

        monacoEditor.getModel()?.onDidChangeContent(() => {
          dispatch(
            detectChangeValue({ onChangeValue: monacoEditor.getValue() })
          );
        });

        return monacoEditor;
      });
    }

    return () => editor?.dispose();
  }, [editorRef.current]);

  useEffect(() => {
    if(editor?.getModel()) {
      editor?.setValue(fileValue);
      setLanguageMode(fileSelected);
    }
  }, [fileValue, fileSelected]);

  const handleSaveUpdate = () => {
    if (editor) {
      const data = editor.getValue();
      dispatch(updateFile({ data }));
      alert("Save");
    }
  };

  return (
    <div className={styles.container}>
      <div ref={editorRef} className={styles.editor} />
      {!isEmptyData && (
        <button
          className={styles.button}
          disabled={!isChangedFile}
          onClick={handleSaveUpdate}
        >
          Save Update
        </button>
      )}
    </div>
  );
}
