'use client'
import RoomDetailPageComponent from "@/src/components/Rooms component/detail/RoomDetailPageComponent";
import { SetStateAction, useState } from "react";

export type ResData = {
  reservationId: string,
  depositPaid: number
}

export default function RoomDetailPage() {
  const [showPayment, setShowPayment] = useState<boolean>(false)
  const [reservationData, setReservationData] = useState<ResData | undefined>(undefined)

  return <RoomDetailPageComponent showPayment={showPayment} reservationData={reservationData} setReservationData={function (value: SetStateAction<ResData>): void {
    throw new Error("Function not implemented.");
  }} setShowPayment={function (value: SetStateAction<boolean>): void {
    throw new Error("Function not implemented.");
  }} />
}
