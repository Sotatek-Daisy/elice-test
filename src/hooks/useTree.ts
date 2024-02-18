import { JSZipObject } from "jszip";
import { FileData, TreeNode } from "types";

export const useTree = () => {
  const getFileField = (file: JSZipObject) => {
    const isFolder = file.dir;
    const splitName = file.name
      .split("/")
      .filter((name: string) => name !== "");
    return {
      label: splitName.slice(-1)[0],
      level: splitName.length,
      isFolder,
      parent: splitName.length > 1 ? splitName.slice(-2)[0] : null,
    };
  };

  const addChildrenTree = (
    files: TreeNode[],
    parent: string | null,
    level: number
  ) => {
    const children: TreeNode[] = [];

    files
      .filter((item) => item.parent === parent && level + 1 === item.level)
      .forEach((childItem) => {
        const childNode = {
          ...childItem,
        };

        const nestedChildren = addChildrenTree(
          files,
          childItem.label,
          childItem.level
        );

        if (nestedChildren.length > 0) {
          childNode.children = nestedChildren;
        } else {
          delete childNode.children;
        }

        children.push(childNode);
      });

    return children;
  };

  const addBigParent = (files: TreeNode[]) => {
    const firstChild = files[0]
    const elParent:TreeNode = {
      stringId: `${firstChild?.parent}/`,
      label: `${firstChild?.parent}`,
      level: 1,
      parent: null,
      isFolder: true,
      dataText: '',
      typeFile: ''
    };
    return [elParent].concat(files)
  };

  const getRootTreeData = (files: FileData[]) => {
    const rawFiles: TreeNode[] = files.map((item: FileData) => {
      const file = JSON.parse(item.rawData);
      const { label, level, parent, isFolder } = getFileField(file);
      return {
        stringId: item.name,
        label,
        level,
        parent,
        isFolder,
        dataText: item.dataText,
        typeFile: item.typeFile
      };
    });

    const finalRawFiles = !!rawFiles.find((item: TreeNode) => !item.parent) || rawFiles.length === 0
      ? rawFiles
      : addBigParent(rawFiles);

    const rootTree = addChildrenTree(finalRawFiles, null, 0);

    return rootTree;
  };

  return {
    getRootTreeData,
  };
};
