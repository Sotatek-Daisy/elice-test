export type FileData = {
  name: string;
  rawData: string;
  dataText: string;
  arrayBufferFile: ArrayBuffer;
  typeFile: string;
};

export type TreeNode = {
  stringId: string;
  label: string;
  level: number;
  parent: string | null;
  isFolder: boolean;
  children?: TreeNode[];
  dataText: string;
  typeFile: string;
};

export type TabData = {
  name: string;
  rawFiles: FileData[];
  selectedFile: string;
};
