import { useEffect, useState } from "react";
import { useAppSelector } from "stores/hooks";
import {
  audioExtensions,
  getExtensionFile,
  imageExtensions,
  videoExtensions,
} from "utils/common";
import styles from "./index.module.css";

export default function BinaryFile() {
  const fileSelected = useAppSelector((state) => state.files.selectedFileId);
  const extensionFile = getExtensionFile(fileSelected);
  const filesTree = useAppSelector((state) => state.files.files);

  const [dataUrl, setDataUrl] = useState("");

  const arrayBufferFile = filesTree.find(
    (item) => item.name === fileSelected
  )?.arrayBufferFile;

  useEffect(() => {
    if (arrayBufferFile) {
      const blob = new Blob([arrayBufferFile], {
        type: `image/${extensionFile}`,
      });
      const url = URL.createObjectURL(blob);
      setDataUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [arrayBufferFile]);

  const renderBinaryFile = () => {
    if (imageExtensions.includes(extensionFile))
      return <img src={dataUrl} className={styles.view} alt={fileSelected} />;

    if (videoExtensions.includes(extensionFile))
      return (
        <video  className={styles.view} controls>
          <source src={dataUrl} type={`video/${extensionFile}`} />
          Your browser does not support the video tag.
        </video>
      );

    if (audioExtensions.includes(extensionFile))
      return <audio controls className={styles.view} src={dataUrl}></audio>;
  };

  return (
    <div className={styles.container}>{dataUrl && renderBinaryFile()}</div>
  );
}
