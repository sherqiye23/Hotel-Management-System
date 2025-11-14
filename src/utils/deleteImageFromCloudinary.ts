import cloudinary from "../lib/cloudinary";
/**
 * * @param shortUrl shortened URL of the image to be deleted
 */
export async function deleteImageFromCloudinary(shortUrl: string): Promise<void> {
    if (!shortUrl) return;

    try {
        const lastDotIndex = shortUrl.lastIndexOf('.');
        const publicId = lastDotIndex !== -1 
            ? shortUrl.substring(0, lastDotIndex) 
            : shortUrl;

        await cloudinary.uploader.destroy(publicId);
        
    } catch (err) {
        console.error("Cloudinary delete error:", err);
    }
}