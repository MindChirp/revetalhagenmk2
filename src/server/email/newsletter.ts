"use server";
import NewsUpdateTemplate from "emails/news-update-template";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendNewsletterProps = {
  recipients: string[];
  articleId: string;
  preview: string;
  title: string;
};
export const sendNewsletter = async ({
  recipients,
  articleId,
  preview,
  title,
}: SendNewsletterProps) => {
  const { data, error } = await resend.batch.send(
    recipients.map((email) => ({
      from: "Revetalhagen (post) <post@revetalhagen.no>",
      to: email,
      subject: "Ny artikkel på Revetalhagen",
      react: NewsUpdateTemplate({
        articleId,
        preview,
        title,
        email,
      }),
    })),
  );

  if (error) {
    return error;
  }

  return data;
};
