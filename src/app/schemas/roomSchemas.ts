import * as Yup from 'yup';

// id
export const roomIdSchema = Yup.object({
    id: Yup.string()
        .required('Room ID is required'),
});

// id
export const roomSlugSchema = Yup.object({
    slug: Yup.string()
        .required('Room slug is required'),
});

// post
export const postRoomSchema = Yup.object({
    name: Yup.string()
        .trim()
        .required("Room name is required")
        .min(3, "Name must be at least 3 characters")
        .max(15, "Name must be at most 15 characters"),

    description: Yup.string()
        .trim()
        .required("Room description is required")
        .max(100, "Description must be at most 100 characters"),

    images: Yup.array()
        .required("Exactly 4 photos must be uploaded.")
        .min(4, "Exactly 4 photos must be uploaded.")
        .max(4, "Exactly 4 photos must be uploaded.")
        .of(
            Yup.mixed<File>()
                .required("Each element in the images array must be a file.")
                .test(
                    'isFile',
                    'Each element must be a valid file object.',
                    (value) => value instanceof File
                )
        ),

    pricePerNight: Yup.number()
        .required("Price per night is required")
        .min(0, "Price per night cannot be negative"),
});

export const patchRateRoomSchema = Yup.object({
    value: Yup.number()
        .required()
        .min(1, "Rating value minimum 1").max(5, "Rating value maximum 5")
})
