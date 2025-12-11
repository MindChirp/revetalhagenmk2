"use server";
import BookingConfirmationAdminTemplate from "emails/booking-confirmation-admin-template";
import BookingConfirmationTemplate from "emails/booking-confirmation-template";
import BookingStatusTemplate from "emails/booking-status-template";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendBookingConfirmationsProps = {
  from?: Date;
  item?: {
    name: string;
  };
  name?: string;
  to?: Date;
  totalPrice?: number;
  bookingReference?: string;
  email: string;
};
const sendBookingConfirmations = async ({
  from = new Date(),
  item = { name: "Ukjent gjenstand" },
  name = "John Doe",
  to = new Date(),
  totalPrice = 600,
  bookingReference = "test-reference",
  email,
}: SendBookingConfirmationsProps) => {
  const { data, error } = await resend.emails.send({
    from: "Revetalhagen (booking) <booking@revetalhagen.no>",
    to: [email],
    subject: "Bookingbekreftelse",
    react: BookingConfirmationTemplate({
      from,
      item,
      name,
      to,
      totalPrice,
      bookingReference,
    }),
  });

  if (error) {
    return error;
  }

  return data;
};

export const sendBookingConfirmationsToAdmin = async ({
  from = new Date(),
  item = { name: "Ukjent gjenstand" },
  name = "John Doe",
  to = new Date(),
  totalPrice = 600,
  bookingReference = "test-reference",
}: Omit<SendBookingConfirmationsProps, "email">) => {
  // Only send to admin emails if in production
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const { data, error } = await resend.emails.send({
    from: "Revetalhagen (booking) <booking@revetalhagen.no>",
    to: ["post@revetalhagen.no"],
    subject: "Ny bookingforespørsel",
    react: BookingConfirmationAdminTemplate({
      from,
      item,
      name,
      to,
      totalPrice,
      bookingReference,
    }),
  });

  if (error) {
    return error;
  }

  return data;
};

export const sendBookingStatusUpdate = async ({
  name = "John Doe",
  to,
  bookingReference = "test-reference",
}: {
  name: string;
  to: string;
  bookingReference: string;
}) => {
  const { data, error } = await resend.emails.send({
    from: "Revetalhagen (booking) <booking@revetalhagen.no>",
    to: [to],
    subject: "Ny bookingforespørsel",
    react: BookingStatusTemplate({
      name,
      bookingReference,
    }),
  });

  if (error) {
    return error;
  }

  return data;
};

export default sendBookingConfirmations;
