import styles from "./App.module.css";
import BinaryFile from "./components/BinaryFile";
import MonacoEditor from "./components/MonacoEditor";
import Tabs from "./components/Tabs";
import Toolbars from "./components/Toolbars";
import { Tree } from "./components/Tree";
import { useAppSelector } from "./stores/hooks";
import { audioExtensions, getExtensionFile, imageExtensions, videoExtensions } from "./utils/common";

function App() {
  const fileSelected = useAppSelector((state) => state.files.selectedFileId);
  const extensionFile = getExtensionFile(fileSelected)
  const listBinaryFiles = imageExtensions.concat(videoExtensions, audioExtensions)

  return (
    <div className={styles.layout}>
      <div className={styles.toolbars}><Toolbars /></div>
      <div className={styles.tabs}><Tabs /></div>
      <div className={styles.treeView}><Tree /></div>
      <div className={styles.editor}>
        {
          listBinaryFiles.includes(extensionFile) ? <BinaryFile /> : <MonacoEditor />
        }
      </div>
    </div>
  );
}

export default App;
