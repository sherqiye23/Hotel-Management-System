import cloudinary from "../lib/cloudinary";
import { CloudinaryResultType } from "../types/cloudinaryResultType";

/**
 * @param img file object to be doünloaded
 * @returns shortened Cloudinary URL
 */
export async function uploadImageToCloudinary(img: File): Promise<string> {
    const arrayBuffer = await img.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result: CloudinaryResultType = await new Promise(
        (resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "room-images-easthotel" },
                (error, uploadResult) => {
                    if (error) return reject(error);
                    resolve(uploadResult as CloudinaryResultType);
                }
            );
            uploadStream.end(buffer);
        }
    );

    const fullImageUrl = result.secure_url;
    const uploadIndex = fullImageUrl.indexOf("/upload/");
    let shortImageUrl = fullImageUrl;

    if (uploadIndex !== -1) {
        shortImageUrl = fullImageUrl.substring(uploadIndex + "/upload/".length);
    }

    return shortImageUrl;
}