import { postHotelSchema } from "@/src/app/schemas/hotelSchemas";
import cloudinary from "@/src/lib/cloudinary";
import Hotel from "@/src/models/hotelModel";
import { handleError } from "@/src/utils/errorHandler";
import { NextRequest, NextResponse } from "next/server";

type CloudinaryResultType = {
    secure_url: string;
    public_id: string;
};

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const data = {
            name: formData.get("name")?.toString(),
            description: formData.get("description")?.toString(),
            images: (formData.getAll("images") as (File | string)[]).filter(item => item instanceof File) as File[],
            pricePerNight: formData.get("pricePerNight") ? Number(formData.get("pricePerNight")) : undefined,
        };

        const validatedData = await postHotelSchema.validate(data, { abortEarly: false });
        const { name, description, images, pricePerNight } = validatedData;


        let uploadedImageUrls: string[] = [];
        if (images && images.length > 0) {
            for (const img of images) {
                if (img instanceof File) {
                    const arrayBuffer = await img.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    const result: CloudinaryResultType = await new Promise((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            { folder: 'hotel-images-easthotel' },
                            (error, uploadResult) => {
                                if (error) return reject(error);
                                resolve(uploadResult as CloudinaryResultType);
                            }
                        );
                        uploadStream.end(buffer);
                    });

                    const fullImageUrl = result.secure_url;
                    const uploadIndex = fullImageUrl.indexOf("/upload/");
                    let shortImageUrl = fullImageUrl;

                    if (uploadIndex !== -1) {
                        shortImageUrl = fullImageUrl.substring(uploadIndex + "/upload/".length);
                    }

                    uploadedImageUrls.push(shortImageUrl);
                } else {
                    return NextResponse.json({
                        message: "Invalid image format",
                        success: false,
                    }, { status: 400 });
                }
            }
        }

        const newHotel = new Hotel({
            name,
            description,
            images: uploadedImageUrls,
            pricePerNight
        });

        const savedHotel = await newHotel.save()

        return NextResponse.json({
            message: 'Hotel successfully created!',
            success: true,
            savedHotel
        }, { status: 201 }) 

    } catch (error: unknown) {
        return handleError(error)
    }
}