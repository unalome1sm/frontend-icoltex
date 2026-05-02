const WHATSAPP_URL = "https://wa.me/573138718187";

export default function CyberBlackDigital40Page() {
  return (
    <article className="mx-auto w-full max-w-4xl">
      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        <p>
          La campaña consiste en otorgar un descuento del 40% en la compra de
          telas de rollo cerrado comercializadas a través de nuestros canales
          digitales: el WhatsApp disponible en el enlace{" "}
          <a
            href={WHATSAPP_URL}
            className="font-medium text-red-600 underline underline-offset-2 hover:text-red-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            {WHATSAPP_URL}
          </a>{" "}
          y las ventas realizadas por los asesores externos de IMPORTADORA
          ICOLTEX S.A.S.
        </p>
        <p>
          Los rollos cerrados no tienen ningún corte y cuentan con 50 o 100
          metros.
        </p>
        <p>
          La promoción estará vigente desde el 01 de diciembre hasta el 02 de
          diciembre de 2025 o hasta agotar existencias, lo que ocurra primero.
        </p>
        <p>
          La promoción no tendrá validez para compras efectuadas en las tiendas
          físicas de ICOLTEX S.A.S.
        </p>
        <p>
          El cliente podrá realizar el pago de sus compras a través de los
          medios habilitados.
        </p>
        <p>
          Este descuento no es acumulable con otras promociones, ofertas,
          descuentos o beneficios adicionales que estén vigentes durante el
          mismo período.
        </p>
        <p>
          Las referencias aplicarán únicamente a las seleccionadas por ICOLTEX
          S.A.S. y estarán sujetas a disponibilidad de inventario.
        </p>
        <p>
          Las telas adquiridas en esta promoción no tienen cambio ni serán
          susceptibles de devoluciones.
        </p>
        <p>La promoción cubre el costo del envío a nivel nacional.</p>
        <p>
          La empresa podrá modificar estos términos y condiciones en cualquier
          momento, sin previo aviso, incluyendo restricciones adicionales o
          ajustes en la vigencia, si las condiciones de la actividad así lo
          requieren.
        </p>
        <p>
          IMPORTADORA ICOLTEX S.A.S. se reserva el derecho de verificar la
          información del cliente, controlar el uso adecuado de esta promoción
          y tomar las medidas necesarias para prevenir usos fraudulentos.
        </p>
        <p>
          El cliente declara que la información proporcionada al momento de la
          compra es veraz y fidedigna, siendo completamente responsable de
          cualquier falsedad en los datos suministrados.
        </p>
      </div>
    </article>
  );
}
