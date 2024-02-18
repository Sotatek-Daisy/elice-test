import { JSZipObject } from "jszip";
import { FileData } from "types";

export const downloadZipFile = async (zipBlob: Blob, fileName: string) => {
  const zipUrl = window.URL.createObjectURL(zipBlob);
  const downloadLink = document.createElement("a");
  downloadLink.href = zipUrl;
  downloadLink.download = fileName;
  downloadLink.click();
  window.URL.revokeObjectURL(zipUrl);
};

export const findFirstNonFolderElement = (file: FileData[]): FileData | null => {
  const isFolder = file.find((file: FileData) => {
    const rawJSZip: JSZipObject = JSON.parse(file.rawData);
    return !rawJSZip.dir;
  });
  return isFolder || null;
};

export const getExtensionFile = (fileName: string) => fileName.split('.')?.pop()?.toLowerCase() || ''

export const imageExtensions = [
  "jpg",
  "jpeg",
  "jpe",
  "png",
  "gif",
  "bmp",
  "tiff",
  "tif",
  "webp",
  "svg",
  "ico",
  "heif",
  "heic"
];

export const audioExtensions = [
  "mp3",
  "wav",
  "flac",
  "ogg",
  "aac",
  "wma",
  "aiff",
  "m4a",
];

export const videoExtensions = [
  "mp4",
  "avi",
  "mov",
  "wmv",
  "flv",
  "mkv",
  "webm",
  "mpg",
  "mpeg",
  "m4v",
  "3gp",
];
