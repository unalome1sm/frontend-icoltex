"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useState, type FormEvent } from "react";
import { CONTACT_SUBJECT_OPTIONS, submitContactForm } from "@/lib/contact";

type FormStatus = "idle" | "submitting" | "success" | "error";

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  privacyAccepted: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const INITIAL_VALUES: FormValues = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  privacyAccepted: false,
};

const inputClassName =
  "w-full rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-600 focus:ring-2 focus:ring-red-600/20";

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Ingresa tu nombre completo.";
  }
  if (!values.email.trim()) {
    errors.email = "Ingresa tu correo electrónico.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "El correo no es válido.";
  }
  if (!values.phone.trim()) {
    errors.phone = "Ingresa tu número celular.";
  }
  if (!values.subject) {
    errors.subject = "Selecciona un motivo.";
  }
  if (!values.message.trim()) {
    errors.message = "Escribe tu mensaje.";
  } else if (values.message.trim().length < 10) {
    errors.message = "El mensaje debe tener al menos 10 caracteres.";
  }
  if (!values.privacyAccepted) {
    errors.privacyAccepted = "Debes aceptar la política de tratamiento de datos.";
  }

  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setSubmitError(null);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    const subjectLabel =
      CONTACT_SUBJECT_OPTIONS.find((option) => option.value === values.subject)
        ?.label ?? values.subject;

    setStatus("submitting");
    try {
      await submitContactForm({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        subject: subjectLabel,
        message: values.message.trim(),
      });
      setStatus("success");
      setValues(INITIAL_VALUES);
    } catch (err) {
      setStatus("error");
      setSubmitError(
        err instanceof Error
          ? err.message
          : "No pudimos enviar el mensaje. Intenta de nuevo.",
      );
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        Envíanos un mensaje
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Cuéntanos qué necesitas y un asesor te responderá en menos de 24 horas
        hábiles.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-1.5">
          <label htmlFor="contact-fullName" className="text-sm font-semibold text-slate-900">
            Nombre completo
          </label>
          <input
            id="contact-fullName"
            name="fullName"
            autoComplete="name"
            className={inputClassName}
            placeholder="Nombre y apellidos *"
            value={values.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            aria-invalid={Boolean(errors.fullName)}
          />
          {errors.fullName ? (
            <p className="text-xs text-red-600">{errors.fullName}</p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="contact-email" className="text-sm font-semibold text-slate-900">
              Correo electrónico
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              className={inputClassName}
              placeholder="correo@empresa.com *"
              value={values.email}
              onChange={(e) => updateField("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? (
              <p className="text-xs text-red-600">{errors.email}</p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact-phone" className="text-sm font-semibold text-slate-900">
              Teléfono / Móvil
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className={inputClassName}
              placeholder="Número celular *"
              value={values.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone ? (
              <p className="text-xs text-red-600">{errors.phone}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-subject" className="text-sm font-semibold text-slate-900">
            Asunto
          </label>
          <select
            id="contact-subject"
            name="subject"
            className={inputClassName}
            value={values.subject}
            onChange={(e) => updateField("subject", e.target.value)}
            aria-invalid={Boolean(errors.subject)}
          >
            <option value="">Selecciona un motivo</option>
            {CONTACT_SUBJECT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.subject ? (
            <p className="text-xs text-red-600">{errors.subject}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-message" className="text-sm font-semibold text-slate-900">
            Mensaje
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            className={`${inputClassName} min-h-[140px] resize-y`}
            placeholder="Cuéntanos en qué podemos ayudarte, qué tipo de tela buscas o el detalle de tu pedido *"
            value={values.message}
            onChange={(e) => updateField("message", e.target.value)}
            aria-invalid={Boolean(errors.message)}
          />
          {errors.message ? (
            <p className="text-xs text-red-600">{errors.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-start gap-2.5 text-sm text-slate-700">
            <button
              type="button"
              role="checkbox"
              aria-checked={values.privacyAccepted}
              aria-invalid={Boolean(errors.privacyAccepted)}
              aria-label="Aceptar política de tratamiento de datos"
              onClick={() =>
                updateField("privacyAccepted", !values.privacyAccepted)
              }
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                values.privacyAccepted
                  ? "border-red-600 bg-white text-red-600"
                  : "border-neutral-300 bg-white"
              }`}
            >
              {values.privacyAccepted ? (
                <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
              ) : null}
            </button>
            <p>
              Acepto la{" "}
              <Link
                href="/about/tratamiento-datos"
                className="font-medium text-slate-900 underline-offset-2 hover:text-red-600 hover:underline"
              >
                política de tratamiento de datos personales
              </Link>{" "}
              y el{" "}
              <Link
                href="/about/tratamiento-datos/autorizacion-y-aviso"
                className="font-medium text-slate-900 underline-offset-2 hover:text-red-600 hover:underline"
              >
                aviso de privacidad
              </Link>{" "}
              de ICOLTEX.
            </p>
          </div>
          {errors.privacyAccepted ? (
            <p className="text-xs text-red-600">{errors.privacyAccepted}</p>
          ) : null}
        </div>

        {status === "success" ? (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800" role="status">
            Gracias. Te contactaremos pronto.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {submitError ?? "No pudimos enviar el mensaje. Intenta de nuevo."}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center rounded-lg bg-red-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "submitting" ? "Enviando…" : "Enviar mensaje"}
        </button>
      </form>
    </div>
  );
}
