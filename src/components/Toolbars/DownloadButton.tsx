import { FaArrowDown } from "react-icons/fa";
import styles from "./index.module.css";
import { useZipFile } from "hooks/useZipFile";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { downloadZipFile } from "utils/common";
import { downloadedChangedFile } from "stores/files/filesSlice";

export default function DownloadButton() {
  const dispatch = useAppDispatch();

  const { convertFilesToZip } = useZipFile();
  const rootFoldername = useAppSelector((state) => state.files.rootFoldername);
  const filesTree = useAppSelector((state) => state.files.files);
  const canDownloadFile = useAppSelector(
    (state) => state.files.canDownloadFile
  );

  const handleDownloadFile = () => {
    convertFilesToZip(filesTree).then((zipBlob: Blob) => {
      if (zipBlob) {
        downloadZipFile(zipBlob, rootFoldername);
        dispatch(downloadedChangedFile());
      }
    });
  };

  return (
    <button
      className={styles.button}
      title="Download File"
      onClick={handleDownloadFile}
      disabled={!canDownloadFile}
    >
      <FaArrowDown />
    </button>
  );
}
