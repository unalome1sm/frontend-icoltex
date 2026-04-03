"use client";

import { useState } from "react";
import { useAuthSidebar } from "@/contexts/AuthSidebarContext";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const { openAuth } = useAuthSidebar();

  return (
    <section
      className="w-full px-4 py-12 md:py-16"
      style={{ backgroundColor: "#EBEBEB" }}
    >
      <div className="mx-auto max-w-xl space-y-4 text-center">
        <h2 className="text-xl font-bold uppercase tracking-tight text-gray-800 md:text-2xl">
          Obtén 15% de descuento
        </h2>
        <p className="text-sm leading-relaxed text-gray-700">
          Suscríbete para obtener 15% de descuento en tu primera compra y
          mantenerte al tanto de nuevos colores, estilos y promociones exclusivas.
        </p>
        <p className="text-xs leading-relaxed text-gray-500">
          Al hacer clic en &quot;registrarte&quot;, aceptas recibir correos
          electrónicos de Icoltex y aceptas nuestros{" "}
          <span className="text-gray-600">Términos de Uso</span> y{" "}
          <span className="text-gray-600">Política de Privacidad</span>
          {/* Enlaces pendientes: /terminos-y-condiciones, /privacidad */}
          .
        </p>
        <form
          className="mx-auto flex max-w-md flex-col gap-3 pt-1"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo electronico"
            className="w-full rounded border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
            aria-label="Correo electrónico"
          />
          <button
            type="button"
            onClick={() => openAuth("register")}
            className="inline-flex w-full items-center justify-center rounded bg-red-600 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Inicia sesión o registrate gratis
          </button>
        </form>
      </div>
    </section>
  );
}
