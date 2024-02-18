import React from "react";
import { FaUpload } from "react-icons/fa";

import styles from "./index.module.css";
import { useZipFile } from "hooks/useZipFile";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { saveFiles } from "stores/files/filesSlice";
import { FileData, TabData } from "types";

export default function UploadButton() {
  const { extractZipToFile } = useZipFile();
  const dispatch = useAppDispatch();
  const tabs = useAppSelector((state) => state.files.tabs);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const zipFile = event.target.files?.[0];
    if (!zipFile) return;

    extractZipToFile(zipFile).then((data: FileData[] | null) => {
      if (data) {
        const tabsName = tabs.map((tab: TabData) => tab.name);
        if (tabsName.includes(zipFile.name)) {
          alert(
            "The file is existed. Please upload another file or change name of this file!"
          );
          return;
        }

        dispatch(saveFiles({ files: data, rootFoldername: zipFile.name }));
      }
    });
  };

  return (
    <>
      <button className={styles.button}>
        <label htmlFor="fileUpload" title="Upload File">
          <FaUpload />
        </label>
      </button>
      <input
        type="file"
        onChange={(e) => handleFileChange(e)}
        accept=".zip"
        id="fileUpload"
        style={{ display: "none" }}
      />
    </>
  );
}
