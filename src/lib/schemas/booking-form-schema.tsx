import { z } from "zod";

export const bookingFormSchema = z
  .object({
    from: z.date({
      message: "Fra-dato må være definert",
    }),
    to: z.date({
      message: "Til-dato må være definert",
    }),
    itemId: z.number(),
    userId: z.number().optional(),
    email: z.string().email({ message: "Ugyldig epostadresse" }).optional(),
    phone: z.string().optional(),
    name: z.string().min(5, {
      message: "Navn er påkrevd",
    }),
    message: z.string().optional(),
    personCount: z.number().min(1).max(100).optional(),
  })
  .refine(
    (data) => {
      console.log("Refining dates: ", data.from, data.to);
      return data.from <= data.to;
    },
    {
      message: "Fra-dato må være før til-dato",
      path: ["from"],
    },
  )
  .refine((data) => !!data.email || !!data.phone, {
    message: "Du må fylle ut enten epost eller telefonnummer",
    path: ["email", "phone"],
  });
