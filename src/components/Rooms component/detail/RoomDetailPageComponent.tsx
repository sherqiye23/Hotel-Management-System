import RoomDetail from "./RoomDetail";
import PaymentPage from "../../Payment components/PaymentPage";
import { ResData } from "@/src/app/(main)/rooms/[roomname]/page";

type RoomDetailTypes = {
    showPayment: boolean,
    reservationData: ResData,
    setReservationData: React.Dispatch<React.SetStateAction<ResData>>;
    setShowPayment: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function RoomDetailPageComponent({
    showPayment,
    reservationData,
    setReservationData,
    setShowPayment
}: RoomDetailTypes) {
    return !showPayment
        ? <RoomDetail setReservationData={setReservationData} setShowPayment={setShowPayment} />
        : <PaymentPage reservationData={reservationData!} />;
}
