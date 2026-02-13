import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadImage(
  fileBuffer: Buffer,
  folder: string = "art-from-heart/orders"
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [
            { quality: "auto", fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error("Upload failed"));
            return;
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      )
      .end(fileBuffer);
  });
}

export async function uploadPortfolioImage(
  fileBuffer: Buffer
): Promise<{ url: string; publicId: string; thumbnailUrl: string }> {
  const result = await uploadImage(fileBuffer, "art-from-heart/portfolio");

  const thumbnailUrl = cloudinary.url(result.publicId, {
    width: 400,
    height: 400,
    crop: "fill",
    quality: "auto",
    fetch_format: "auto",
  });

  return {
    ...result,
    thumbnailUrl,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
