'use client'
import RoomDetailPageComponent from "@/src/components/Rooms component/detail/RoomDetailPageComponent";
import { useState } from "react";

export type ResData = {
  reservationId: string,
  depositPaid: number
}

export default function RoomDetailPage() {
  const [showPayment, setShowPayment] = useState<boolean>(false)
  const [reservationData, setReservationData] = useState<ResData>({
    reservationId: '',
    depositPaid: 0
  })

  return <RoomDetailPageComponent showPayment={showPayment} reservationData={reservationData} setReservationData={setReservationData} setShowPayment={setShowPayment} />
}
