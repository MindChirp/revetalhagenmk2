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
  const { data, error } = await resend.emails.send({
    from: "Revetalhagen (post) <post@revetalhagen.no>",
    to: recipients,
    subject: "Ny artikkel på Revetalhagen",
    react: NewsUpdateTemplate({
      articleId,
      preview,
      title,
    }),
  });

  if (error) {
    return error;
  }

  return data;
};
