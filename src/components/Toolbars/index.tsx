import DownloadButton from "./DownloadButton";
import UploadButton from "./UploadButton";
import styles from "./index.module.css";

export default function Toolbars() {
  return (
    <div className={styles.header}>
      <UploadButton />
      <DownloadButton />
    </div>
  );
}
