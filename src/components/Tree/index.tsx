import { useCallback, useEffect, useState } from "react";
import styles from "./index.module.css";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { useZipFile } from "hooks/useZipFile";
import { saveFiles } from "stores/files/filesSlice";
import { useTree } from "hooks/useTree";
import { FileData, TreeNode } from "types";
import SubsequentTree from "./SubsequentTree";

export const Tree: React.FC = () => {
  const [isDragOver, setIsDragOver] = useState(false);

  const filesTree = useAppSelector((state) => state.files.files);

  const { getRootTreeData } = useTree();

  const [treeData, setTreeData] = useState<TreeNode[] | null>(null);

  const { extractZipToFile } = useZipFile();
  const dispatch = useAppDispatch();

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const handleFile = (file: File) => {
    if (!file) return;

    extractZipToFile(file).then((data: FileData[] | null) => {
      if (data) {
        console.warn(data);
        dispatch(saveFiles({ files: data, rootFoldername: file.name }));
        setIsDragOver(false);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleMouseLeave = () => {
    setIsDragOver(false);
  };

  useEffect(() => {
    async function getTree() {
      const data = await getRootTreeData(filesTree);
      setTreeData(data);
    }

    getTree();
  }, [filesTree]);

  return (
    <div
      className={styles.container}
      onDragOver={handleDragOver}
      onMouseLeave={handleMouseLeave}
    >
      {isDragOver ? (
        <div
          className={styles.dropZone}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p>Drag and drop file here</p>
        </div>
      ) : (
        <>
          {treeData && treeData.length > 0 ? (
            treeData.map((node: TreeNode) => (
              <SubsequentTree key={node.stringId} node={node} />
            ))
          ) : (
            <p className={styles.emptyText}>No data</p>
          )}
        </>
      )}
    </div>
  );
};
