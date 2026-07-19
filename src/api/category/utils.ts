import { removeFiles, uploadFile } from "../../utils/file";
import { TCategory, UCategory } from "./types";

export const handleCategoryImage = async <T extends TCategory | UCategory>(
  body: T,
) => {
  const isTemporaryImage = body.image?.startsWith("/tmp/") ?? false;
  if (isTemporaryImage && body.image) {
    const image = await uploadFile(body.image);
    if (!image) throw new Error("The category image could not be uploaded");
    body.image = image;
  }
  return { body, uploadedImage: isTemporaryImage ? body.image || null : null };
};

export const removeCategoryImages = async (
  urls?: Array<string | null>,
  currentImage?: string | null,
) =>
  removeFiles(
    [...new Set(urls || [])].filter((url) => url && url !== currentImage),
  );
