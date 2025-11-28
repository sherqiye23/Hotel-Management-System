import * as Yup from 'yup';

// id
export const reservationIdSchema = Yup.object({
    id: Yup.string()
        .required('Reservation ID is required'),
});
export const schemaReservationId = Yup.string().required("reservationId is required");

// post
export const newReservationSchema = Yup.object({
    startReservedTime: Yup.string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
        .required("Start date is required"),

    endReservedTime: Yup.string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)")
        .required("End date is required"),
});

// payment
export const paymentReservationSchema = Yup.object({
    totalPrice: Yup.number()
        .min(0, "Total price cannot be negative")
        .required("Total price is required"),
});

export const statusConfirmedMailSchema = Yup.object({
    email: Yup.string()
        .trim()
        .email('Invalid email address')
        .required('Email is required'),
})
