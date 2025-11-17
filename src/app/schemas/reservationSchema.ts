import * as Yup from 'yup';

// id
export const reservationIdSchema = Yup.object({
    id: Yup.string()
        .required('Reservation ID is required'),
});
export const schemaReservationId = Yup.string().required("reservationId is required");

// post and patch
export const newReservationSchema = Yup.object({
    startReservedTime: Yup.date()
        .nullable()
        .min(new Date(), "Start date cannot be in the past")
        .required("Start date is required"),
    endReservedTime: Yup.date()
        .nullable()
        .min(
            Yup.ref("startReservedTime"),
            "End date cannot be before start date"
        )
        .required("End date is required"),
});

// payment
export const paymentReservationSchema = Yup.object({
    totalPrice: Yup.number()
        .min(0, "Total price cannot be negative")
        .required("Total price is required"),
});