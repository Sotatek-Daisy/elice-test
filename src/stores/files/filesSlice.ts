import { createSlice } from "@reduxjs/toolkit";
import {
  AddFilePayload,
  DeleteFilePayload,
  detectChangeValuePayload,
  SaveFilePayload,
  SelectedFilePayload,
  SelectedTabPayload,
  UpdateFilePayload,
  filesState,
} from "./filesType";
import { FileData, TabData } from "types";
import { findFirstNonFolderElement } from "utils/common";

const initialState: filesState = {
  files: [],
  rootFoldername: "",
  selectedFileId: "",
  value: "",
  tabs: [],
  isChangedFile: false,
  canDownloadFile: false,
};

export const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    saveFiles: (state, { payload }: SaveFilePayload) => {
      // update file view
      state.files = payload.files;
      state.rootFoldername = payload.rootFoldername;

      // set default file selected
      const defaultSelectedFile = findFirstNonFolderElement(payload.files);
      state.selectedFileId = defaultSelectedFile?.name || "";
      state.value = defaultSelectedFile?.dataText || "";

      // update tabs
      const isEmptyTabs = !!(state.tabs.length === 0);
      const tab: TabData = {
        name: payload.rootFoldername,
        rawFiles: payload.files,
        selectedFile: defaultSelectedFile?.name || "",
      };
      state.tabs = isEmptyTabs ? [tab] : [...state.tabs, tab];
    },
    selectedFile: (state, { payload }: SelectedFilePayload) => {
      state.selectedFileId = payload.selectedFileId;
      state.value = payload.value;

      // save selected file each tab
      state.tabs = state.tabs.map((tab: TabData) =>
        tab.name === state.rootFoldername
          ? { ...tab, selectedFile: payload.selectedFileId }
          : tab
      );
    },
    updateFile: (state, { payload }: UpdateFilePayload) => {
      const dataFiles = state.files.map((file: FileData) => {
        return {
          ...file,
          dataText:
            state.selectedFileId === file.name ? payload.data : file.dataText,
        };
      });
      state.files = dataFiles;
      state.value = payload.data;

      // save updated file each tab
      state.tabs = state.tabs.map((tab: TabData) =>
        tab.name === state.rootFoldername
          ? { ...tab, rawFiles: dataFiles }
          : tab
      );

      state.canDownloadFile = true;
    },
    deleteFile: (state, { payload }: DeleteFilePayload) => {
      const dataFiles = state.files.filter(
        (file: FileData) => file.name !== payload.fileName
      );
      state.files = dataFiles;

      // change focus file
      const defaultSelectedFile = findFirstNonFolderElement(dataFiles);
      state.selectedFileId = defaultSelectedFile?.name || "";
      state.value = defaultSelectedFile?.dataText || "";

      // save delete file each tab
      state.tabs = state.tabs.map((tab: TabData) =>
        tab.name === state.rootFoldername
          ? { ...tab, rawFiles: dataFiles }
          : tab
      );

      state.canDownloadFile = true;
    },
    addFile: (state, { payload }: AddFilePayload) => {
      // add new file to files data
      const positionToInsert =
        state.files.findIndex(
          (item: FileData) => item.name === payload.nodeParentName
        ) + 1;
      state.files.splice(positionToInsert, 0, payload.file);

      // add files data to tab
      state.tabs = state.tabs.map((tab: TabData) =>
        tab.name === state.rootFoldername
          ? {
              ...tab,
              rawFiles: state.files,
              selectedFile: payload.file.name,
            }
          : tab
      );

      // focus to added-file
      state.selectedFileId = payload.file.name;
      state.value = payload.file.dataText;

      state.canDownloadFile = true;
    },
    selectedTab: (state, { payload }: SelectedTabPayload) => {
      state.rootFoldername = payload.tabName;

      const clickedTab = state.tabs.find(
        (tab: TabData) => tab.name === payload.tabName
      );
      state.files = clickedTab?.rawFiles || [];
      state.selectedFileId = clickedTab?.selectedFile || "";
      state.value =
        clickedTab?.rawFiles.find(
          (file: FileData) => file.name === clickedTab.selectedFile
        )?.dataText || "";
    },
    closeTab: (state, { payload }: SelectedTabPayload) => {
      const isCloseOpenedTab = payload.tabName === state.rootFoldername;

      // set default tab when close
      if (isCloseOpenedTab) {
        const closedTabIndex = state.tabs.findIndex(
          (tab: TabData) => tab.name === payload.tabName
        );
        const previousTab = state.tabs[closedTabIndex - 1];
        state.rootFoldername = previousTab?.name || "";
        state.files = previousTab?.rawFiles || [];
        state.selectedFileId = previousTab?.selectedFile || "";
        state.value =
          previousTab?.rawFiles.find(
            (file: FileData) => file.name === previousTab?.selectedFile
          )?.dataText || "";
      }

      state.tabs = state.tabs.filter(
        (tab: TabData) => tab.name !== payload.tabName
      );
    },
    detectChangeValue: (state, { payload }: detectChangeValuePayload) => {
      state.isChangedFile = state.value !== payload.onChangeValue;
    },
    downloadedChangedFile: (state) => {
      state.canDownloadFile = false;
    },
  },
});

export const {
  saveFiles,
  updateFile,
  selectedFile,
  deleteFile,
  addFile,
  selectedTab,
  closeTab,
  detectChangeValue,
  downloadedChangedFile,
} = filesSlice.actions;

export default filesSlice.reducer;
