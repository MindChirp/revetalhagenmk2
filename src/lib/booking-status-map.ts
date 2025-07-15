import type { BookingStates } from "@/server/db/schema";

export const BookingStatusMap: Record<(typeof BookingStates)[number], string> =
  {
    pending: "Avventet",
    confirmed: "Godkjent",
    rejected: "Avslått",
    cancelled: "Kansellert",
    completed: "Gjennomført",
  } as const;
