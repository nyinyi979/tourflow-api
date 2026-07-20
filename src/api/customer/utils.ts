import { removeFiles, uploadFile } from "../../utils/file";
import type { TCustomerSignup, TCustomerUpdate } from "./schemas";

export const handleCustomerAvatar = async <
  T extends TCustomerSignup | TCustomerUpdate,
>(
  body: T,
) => {
  // The frontend sends temporary uploads as /tmp/...; existing remote URLs stay unchanged.
  const isTemporaryAvatar = body.avatar?.startsWith("/tmp/") ?? false;

  if (body.avatar?.startsWith("/tmp/")) {
    const uploadedAvatar = await uploadFile(body.avatar);
    if (!uploadedAvatar) {
      throw new Error("The temporary customer avatar could not be uploaded");
    }
    body.avatar = uploadedAvatar;
  }

  return {
    body,
    uploadedAvatar: isTemporaryAvatar ? body.avatar || null : null,
  };
};

export const removeCustomerAvatars = async (
  imageUrls?: Array<string | null>,
  currentAvatar?: string | null,
) => {
  const unusedImageUrls = [...new Set(imageUrls || [])].filter(
    (imageUrl) => imageUrl && imageUrl !== currentAvatar,
  );

  await removeFiles(unusedImageUrls);
};
