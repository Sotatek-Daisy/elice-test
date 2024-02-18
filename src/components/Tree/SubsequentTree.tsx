import React, { ReactElement, useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaFile,
  FaFileAudio,
  FaFileImage,
  FaFileVideo,
  FaFolder,
  FaFolderOpen,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import styles from "./index.module.css";
import { useAppDispatch, useAppSelector } from "stores/hooks";
import { useZipFile } from "hooks/useZipFile";
import {
  addFile,
  deleteFile,
  selectedFile,
} from "stores/files/filesSlice";
import {
  audioExtensions,
  imageExtensions,
  videoExtensions,
} from "utils/common";
import { FileData, TreeNode } from "types";

interface NodeProps {
  node: TreeNode;
}

export default function SubsequentTree({ node }: NodeProps) {
  const [expand, isExpand] = useState<boolean>(true);
  const [hover, isHover] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const fileSelected = useAppSelector((state) => state.files.selectedFileId);
  const { getOneFileAdd } = useZipFile();

  // render function
  const handleActionFile = () => {
    if (node.isFolder) {
      isExpand(!expand);
    } else {
      dispatch(
        selectedFile({ selectedFileId: node.stringId, value: node.dataText })
      );
    }
  };

  const handleHoverFile = () => isHover(true);
  const handleLeaveFile = () => isHover(false);

  const handleDeleteFile = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    dispatch(deleteFile({ fileName: node.stringId }));
  };

  const handleAddFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const nodeParent = node.isFolder
      ? node.stringId
      : node.stringId.replace(node.label, "");

    getOneFileAdd(file, nodeParent).then((data: FileData | undefined) => {
      if (data) {
        dispatch(addFile({ file: data, nodeParentName: node.stringId }));
      }
    });
  };

  // render UI
  const renderFolderIcon = () =>
    expand ? (
      <div className={styles.folder}>
        <FaFolderOpen /> <FaChevronDown size={10} />
      </div>
    ) : (
      <div className={styles.folder}>
        <FaFolder /> <FaChevronRight size={10} />
      </div>
    );

  const renderHoverIcon = () => (
    <div className={styles.hoverContainer}>
      {!node.isFolder && (
        <button
          className={styles.icon}
          onClick={handleDeleteFile}
          title="Delete File"
        >
          <FaTrash />
        </button>
      )}
      <button
        className={styles.icon}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
          event.stopPropagation()
        }
        title="Add File"
      >
        <input
          type="file"
          onChange={handleAddFile}
          id="addFile"
          style={{ display: "none" }}
        ></input>
        <label htmlFor="addFile">
          <FaPlus />
        </label>
      </button>
    </div>
  );

  const renderFileIcon = () => {
    let icon: ReactElement;
    switch (true) {
      case imageExtensions.includes(node.typeFile):
        icon = <FaFileImage />;
        break;
      case audioExtensions.includes(node.typeFile):
        icon = <FaFileAudio />;
        break;
      case videoExtensions.includes(node.typeFile):
        icon = <FaFileVideo />;
        break;
      default:
        icon = <FaFile />;
        break;
    }
    return <div className={styles.folder}>{icon}</div>;
  };

  const dynamicStyles = {
    paddingLeft: `${node.level}rem`,
    backgroundColor: fileSelected === node.stringId ? "white" : "transparent",
  };

  return (
    <div>
      <div
        className={styles.file}
        onMouseOver={handleHoverFile}
        onMouseLeave={handleLeaveFile}
        style={dynamicStyles}
        onClick={handleActionFile}
      >
        {node.isFolder ? renderFolderIcon() : renderFileIcon()}
        {node.label}
        {hover && renderHoverIcon()}
      </div>
      {node && node.children && expand && (
        <div>
          {node.children.map((childNode: TreeNode) => (
            <span key={childNode.stringId}>
              <SubsequentTree node={childNode} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
