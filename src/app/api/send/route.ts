import BookingConfirmationTemplate from "emails/booking-confirmation-template";
import type { NextApiRequest, NextApiResponse } from "next";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { data, error } = await resend.emails.send({
    from: "Post <post@revetalhagen.no>",
    to: ["frikk44@gmail.com"],
    subject: "Bookingbekreftelse",
    react: BookingConfirmationTemplate({
      from: new Date(),
      item: { name: "Test Item" },
      name: "John Doe",
      to: new Date(),
      totalPrice: 600,
    }),
  });

  if (error) {
    return res.status(400).json(error);
  }

  res.status(200).json(data);
};

export default handler;
