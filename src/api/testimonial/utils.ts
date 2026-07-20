import { removeFiles, uploadFile } from "../../utils/file";
import type { TTestimonial, UTestimonial } from "./schemas";
export const handleTestimonialAvatar = async <
  T extends TTestimonial | UTestimonial,
>(
  body: T,
) => {
  const temporary = body.avatar?.startsWith("/tmp/") ?? false;
  if (temporary && body.avatar) {
    const avatar = await uploadFile(body.avatar);
    if (!avatar)
      throw new Error("The testimonial avatar could not be uploaded");
    body.avatar = avatar;
  }
  return { body, uploadedAvatar: temporary ? body.avatar || null : null };
};
export const removeTestimonialAvatars = async (
  urls?: Array<string | null>,
  current?: string | null,
) =>
  removeFiles([...new Set(urls || [])].filter((url) => url && url !== current));
