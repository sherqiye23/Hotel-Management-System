'use client';
import { useMyContext } from '@/src/context/UserInfoContext';
import { useConfirmReservationMutation } from '@/src/lib/features/reservation/reservationSlice';
import { handleFormError } from '@/src/utils/handleFormError';
import { useEffect } from 'react';

interface ConfirmReservationClientProps {
    reservationId: string;
}

export default function ConfirmReservationClient({ reservationId }: ConfirmReservationClientProps) {
    const [confirmReservation] = useConfirmReservationMutation();
    const { userInfo } = useMyContext();

    useEffect(() => {
        if (!reservationId) return;

        const confirm = async () => {
            try {
                await confirmReservation({
                    id: reservationId,
                    confirmBody: userInfo?.email
                });
            } catch (err) {
                handleFormError(err);
            }
        };
        confirm();
    }, [reservationId, userInfo, confirmReservation]);

    return null;
}
