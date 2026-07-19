import {
  removeFile,
  saveFileToTmp,
  TFile,
  uploadFileRealPath,
} from "../../utils/file";

export const createFile = async (data: TFile) => {
  return await saveFileToTmp(data);
};

export const createBatchFiles = async (data: TFile[]) => {
  return await Promise.all(data.map((item) => saveFileToTmp(item)));
};

export const uploadFile = async (data: string) => {
  return await uploadFileRealPath(data);
};

export const deleteFile = async (filePath: string) => {
  return await removeFile(filePath);
};
