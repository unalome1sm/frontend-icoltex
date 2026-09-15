import { apiFetch } from "@/lib/api";

export type SubmitContactFormPayload = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type SubmitContactFormResponse = {
  ok: boolean;
};

export async function submitContactForm(
  payload: SubmitContactFormPayload,
): Promise<SubmitContactFormResponse> {
  return apiFetch<SubmitContactFormResponse>("/api/contact", {
    method: "POST",
    body: payload,
  });
}
