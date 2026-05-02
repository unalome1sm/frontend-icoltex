export default function TratamientoDatosDerechosPage() {
  return (
    <article className="mx-auto w-full max-w-4xl">
      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        <p className="font-semibold text-slate-900">
          5. DERECHOS DE LOS TITULARES DE DATOS PERSONALES
        </p>
        <p>
          Los titulares de datos personales podrán ejercer los siguientes
          derechos respecto de sus datos:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-slate-900">Acceso:</span> consultar
            de manera gratuita al menos una vez al mes calendario, y cuando haya
            cambios sustanciales.
          </li>
          <li>
            <span className="font-medium text-slate-900">
              Actualización, rectificación y supresión:
            </span>{" "}
            solicitar corrección o eliminación cuando proceda.
          </li>
          <li>
            <span className="font-medium text-slate-900">
              Solicitar prueba de autorización:
            </span>{" "}
            salvo excepciones legales.
          </li>
          <li>
            <span className="font-medium text-slate-900">Ser informado:</span>{" "}
            sobre el uso del dato personal.
          </li>
          <li>
            <span className="font-medium text-slate-900">Quejas:</span>{" "}
            presentar quejas ante la Superintendencia de Industria y Comercio.
          </li>
        </ul>
        <p className="text-xs text-slate-500">
          Nota: Para ejercer derechos, el titular o representante debe demostrar
          identidad y legitimación. Los derechos de menores se ejercen por sus
          representantes.
        </p>
      </div>
    </article>
  );
}

