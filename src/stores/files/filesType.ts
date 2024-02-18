import { PayloadAction } from "@reduxjs/toolkit";
import { FileData, TabData } from "types";

export interface filesState {
  files: FileData[];
  rootFoldername: string;
  selectedFileId: string;
  value: string;
  tabs: TabData[];
  isChangedFile: boolean;
  canDownloadFile: boolean;
}

export type UpdateFilePayload = PayloadAction<{ data: string }>;

export type SaveFilePayload = PayloadAction<{ files: FileData[]; rootFoldername: string }>;

export type SelectedFilePayload = PayloadAction<{
  selectedFileId: string;
  value: string;
}>;

export type DeleteFilePayload = PayloadAction<{ fileName: string }>;

export type AddFilePayload = PayloadAction<{ file: FileData, nodeParentName: string }>;

export type SelectedTabPayload = PayloadAction<{ tabName: string }>;

export type detectChangeValuePayload = PayloadAction<{ onChangeValue: string }>;