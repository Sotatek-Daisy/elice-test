import JSZip from "jszip";
import { getExtensionFile } from "utils/common";
import { FileData } from "types";

export const useZipFile = () => {
  const getFiles = async (zipData: JSZip): Promise<FileData[]> => {
    let files: FileData[] = [];
    try {
      const fileDataPromise = Object.keys(zipData.files).map(
        async (fileName) => {
          const file = zipData.files[fileName];
          const arrayBufferFile = await file.async("arraybuffer");
          return file.async("string").then((value: string) => ({
            dataText: value,
            name: file.name,
            rawData: JSON.stringify(file),
            arrayBufferFile,
            typeFile: file.dir ? "" : getExtensionFile(file.name),
          }));
        }
      );
      files = await Promise.all(fileDataPromise);
    } catch (error) {
      console.warn("Read file error");
    }

    return files;
  };

  const readFileAsync = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Error reading file."));
        }
      };
      reader.readAsText(file);
    });
  };

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to read file as ArrayBuffer."));
        }
      };

      reader.onerror = () => {
        reject(
          reader.error ||
            new Error("Unknown error occurred while reading the file.")
        );
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const getOneFileAdd = async (file: File, nodeParent: string) => {
    try {
      if (file.type.includes("compressed")) {
        alert("Not allow input compressed file! ");
        return;
      }

      const fileContent = await readFileAsync(file);
      const zip = new JSZip();
      zip.file(file.name, fileContent);

      const filezip = zip.files[file.name];
      const arrayBufferFile = await readFileAsArrayBuffer(file);

      filezip.name = nodeParent + file.name;

      return filezip.async("string").then((value: string) => ({
        dataText: value,
        name: nodeParent + file.name,
        rawData: JSON.stringify(filezip),
        arrayBufferFile,
        typeFile: file.type.split("/").pop()?.toLowerCase() || "",
      }));
    } catch (error) {
      console.warn("Read file error");
    }
  };

  const extractZipToFile = (files: File): Promise<FileData[] | null> => {
    const zip = new JSZip();
    return zip.loadAsync(files).then(
      (zipData: JSZip) => getFiles(zipData),
      () => {
        alert("Not a valid zip file");
        return null;
      }
    );
  };

  const convertFilesToZip = async (files: FileData[]) => {
    const zip = new JSZip();

    files.forEach(async ({ name, arrayBufferFile }) => {
      zip.file(name, arrayBufferFile);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });

    return zipBlob;
  };

  return {
    extractZipToFile,
    convertFilesToZip,
    getOneFileAdd,
  };
};
