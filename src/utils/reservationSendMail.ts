import { transporter } from "../lib/nodemaillerCreateTransport";
import { IReservationforMail } from "../types/modelTypes";

export async function sendMailforRes(
  to: string,
  reservation: IReservationforMail
) {
  const roomName = reservation.roomId.name;
  const start = new Date(reservation.startReservedTime)
    .toLocaleString("az-AZ", { timeZone: "Asia/Baku" });
  const end = new Date(reservation.endReservedTime)
    .toLocaleString("az-AZ", { timeZone: "Asia/Baku" });

  const mailOptions = {
    from: `"Room Reservation" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Your Room Reservation - EastHotel",
    html: `
    <div style="
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: #f7f7f7;
      padding: 30px 10px;
      text-align: center; 
      ">
      <div style="
        max-width: 500px;
        margin: auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        border-top: 5px solid #007bff;
        ">
        <div style="padding: 30px;">
          <h1 style="
            color: #007bff;
            font-size: 24px; 
            margin-bottom: 25px;
            ">
            EastHotel
            </h1>

            <h2 style="
            color: #212529; 
            font-size: 20px;
            margin-top: 0;
            margin-bottom: 10px;
            ">
            Reservation Confirmed! 🎉
            </h2>

            <p style="color: #6c757d; font-size: 15px; margin-bottom: 30px;">
            Your room has been successfully reserved. Here are the details:
            </p>

            <div style="
             background: #e6f2ff;
             border-radius: 8px;
             padding: 20px;
             text-align: left;
             font-size: 15px;
             color: #343a40;
             line-height: 1.8;
             border-left: 4px solid #007bff;
             ">
             <p style="margin: 0 0 10px 0;">
             <strong>Room Name:</strong> <span style="font-weight: 600; color: #007bff;">${roomName}</span>
             </p>
             <p style="margin: 0 0 10px 0;">
             <strong>Start Date:</strong> ${start}
             </p>
             <p style="margin: 0;">
             <strong>End Date:</strong> ${end}
             </p>
             </div>
             <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
             If you have any questions, please feel free to contact us.
             </p>

             </div>
             
             <div style="
             background: #e9ecef; 
             padding: 15px; 
             color: #6c757d; 
             font-size: 12px;
             border-bottom-left-radius: 12px;
             border-bottom-right-radius: 12px;
             ">
             © ${new Date().getFullYear()} East Hotel | Happy Stays!
             </div>
             </div>
             </div>
             `,
  };

  await transporter.sendMail(mailOptions);
}
