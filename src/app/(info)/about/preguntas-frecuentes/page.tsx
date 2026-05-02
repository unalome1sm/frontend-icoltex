"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = {
  id: string;
  question: string;
  answer: React.ReactNode;
};

export default function PreguntasFrecuentesPage() {
  const items: FaqItem[] = useMemo(
    () => [
      {
        id: "1",
        question: "¿Cómo puedo acceder al catálogo digital?",
        answer:
          "Nuestro catálogo está disponible a través de WhatsApp. Un asesor te enviará las referencias actualizadas y promociones vigentes.",
      },
      {
        id: "2",
        question: "¿Los precios son los mismos en la tienda física y en el canal digital?",
        answer:
          "Sí, manejamos precios unificados. Sin embargo, en el canal digital puedes acceder a promociones exclusivas.",
      },
      {
        id: "3",
        question: "¿Puedo solicitar asesoría personalizada?",
        answer:
          "Claro, nuestros asesores digitales están disponibles para recomendarte telas según tu necesidad: confección, decoración, moda o proyectos específicos.",
      },
      {
        id: "4",
        question: "¿Qué pasa si un producto no está disponible?",
        answer:
          "Si un producto está agotado, te ofrecemos alternativas similares o te informamos la fecha estimada de reposición.",
      },
      {
        id: "5",
        question: "¿Cómo sé que mi pago es seguro?",
        answer:
          "Trabajamos únicamente con cuentas bancarias oficiales y plataformas reconocidas. Nunca solicitamos pagos a cuentas personales.",
      },
      {
        id: "6",
        question: "¿Puedo pedir muestras de tela antes de comprar?",
        answer:
          "Sí, puedes solicitar muestras en ciertos productos. El costo y envío de las muestras se coordina directamente con el asesor.",
      },
      {
        id: "7",
        question: "¿Qué beneficios tengo al comprar por WhatsApp?",
        answer: (
          <ul className="list-disc space-y-1 pl-5">
            <li>Atención personalizada.</li>
            <li>Promociones exclusivas.</li>
            <li>Seguimiento directo de tu pedido.</li>
            <li>Comunicación rápida y sencilla.</li>
          </ul>
        ),
      },
      {
        id: "8",
        question: "¿Qué debo hacer si tengo un problema con mi compra digital?",
        answer:
          "Debes comunicarte con nuestro canal de atención al cliente digital. Allí podrás radicar una PQRS (Petición, Queja, Reclamo o Sugerencia) y recibirás respuesta en los tiempos establecidos.",
      },
      {
        id: "9",
        question: "¿Puedo comprar al por mayor por el canal digital?",
        answer:
          "Sí, atendemos tanto clientes minoristas como mayoristas. El asesor te dará la información de descuentos por volumen.",
      },
      {
        id: "10",
        question: "¿Cómo puedo estar al día con las novedades?",
        answer:
          "Puedes seguirnos en nuestras redes sociales y suscribirte a nuestra página para recibir lanzamientos y promociones.",
      },
      {
        id: "11",
        question: "¿Qué pasa si mi pedido llega incompleto o con daños?",
        answer:
          "Debes informarnos inmediatamente a través de WhatsApp. Nosotros te ayudaremos a gestionar el reclamo ante la transportadora y buscaremos una solución adecuada.",
      },
      {
        id: "12",
        question: "¿Realizan envíos internacionales?",
        answer:
          "Actualmente realizamos envíos a todo el territorio colombiano. Para envíos internacionales, consulta previamente con nuestro equipo de ventas digitales.",
      },
      {
        id: "13",
        question: "¿Puedo devolver un producto?",
        answer:
          "Las devoluciones se aceptan únicamente en casos de defectos de fábrica o errores en el despacho. El cliente debe notificarlo en un plazo máximo de 48 horas después de recibir el pedido.",
      },
    ],
    [],
  );

  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <article className="mx-auto w-full max-w-4xl">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Compras digitales Icoltex
        </p>

        <div className="space-y-2">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} className="bg-slate-100/70">
                <button
                  type="button"
                  onClick={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
                  className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${item.id}`}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-[1px] text-sm font-semibold text-red-600">
                      {item.id}.
                    </span>
                    <span className="min-w-0 text-sm font-medium text-slate-900">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={[
                      "h-4 w-4 shrink-0 text-slate-600 transition-transform",
                      isOpen ? "rotate-180" : "",
                    ].join(" ")}
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-${item.id}`}
                    className="px-4 pb-4 pl-[2.75rem] text-sm leading-relaxed text-slate-700"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}

