export default function NuestraHistoriaPage() {
  return (
    <article className="mx-auto w-full max-w-4xl">
      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        <p>
          ICOLTEX nace el 12 de septiembre de 2014 en la ciudad de Bogotá bajo la
          razón social Import and Export ASC S.A.S., con el propósito de aportar
          al desarrollo del sector textil colombiano a través de la importación y
          comercialización de productos textiles de alta calidad.
        </p>
        <p>
          Desde sus inicios, la empresa fue liderada por su representante legal,
          Andony Sebastian Castañeda Fernández, quien, con visión emprendedora y
          compromiso, sentó las bases de lo que hoy es una organización sólida y
          en constante crecimiento.
        </p>
        <p>
          En el año 2017, la compañía da un paso decisivo en su evolución al
          cambiar su razón social a Importadora Icoltex S.A.S., consolidando su
          identidad y abriendo su primer almacén al público. Este hito marcó el
          inicio de un proceso de expansión que permitió ampliar progresivamente
          sus puntos de venta y fortalecer su presencia en el mercado nacional.
        </p>
        <p>
          ICOLTEX se especializa en la importación y comercialización de productos
          textiles de alta calidad, dirigidos principalmente al sector de la
          confección y a diversos mercados en todo el país. Nuestro compromiso
          con la excelencia, la innovación y el servicio ha sido clave para
          posicionarnos como un aliado estratégico para nuestros clientes.
        </p>
        <p>
          Entre los años 2019 y 2021, la empresa logró un importante
          reconocimiento a nivel nacional gracias a su participación en los
          principales eventos del sector, como Colombiatex, Colombiamoda y
          Createx, realizados en Medellín y Bogotá. Estos espacios permitieron
          fortalecer relaciones comerciales, conocer tendencias y reafirmar
          nuestro liderazgo en la industria.
        </p>
        <p>
          En el año 2021, la compañía consolidó un equipo humano conformado por
          más de 80 colaboradores, quienes, con su esfuerzo, talento y compromiso,
          representan el motor fundamental de nuestro crecimiento y éxito.
        </p>
        <p>
          Actualmente, ICOLTEX cuenta con bodegas propias de almacenamiento,
          ubicadas principalmente en la Zona Franca de Mosquera, lo que garantiza
          eficiencia logística, disponibilidad de producto y altos estándares
          operativos.
        </p>
        <p>
          Hoy, ICOLTEX continúa evolucionando con una visión clara hacia el
          futuro. Contamos con un equipo humano conformado por casi 200
          colaboradores y con más de 12 puntos de venta con presencia en las
          principales ciudades del país, lo que nos permite estar cada vez más
          cerca de nuestros clientes.
        </p>
        <p>
          Seguimos trabajando con pasión, innovación y compromiso para ofrecer
          soluciones textiles confiables, sostenibles y de alta calidad.
        </p>
        <div className="pt-2">
          <h2 className="text-sm font-semibold text-slate-900">Misión</h2>
          <p className="mt-2">
            Somos una empresa dedicada a la importación y comercialización de
            textiles. Ofrecemos un amplio portafolio de productos que garantizan
            la calidad y precios competitivos en el mercado.
          </p>
        </div>
        <div className="pt-1">
          <h2 className="text-sm font-semibold text-slate-900">Visión</h2>
          <p className="mt-2">
            Ser líder en el mercado textil, marcar tendencias e innovar en bases
            textiles.
          </p>
        </div>
        <div className="pt-1">
          <h2 className="text-sm font-semibold text-slate-900">Valores</h2>
          <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-sm text-slate-700">
            {[
              "Confianza",
              "Creatividad",
              "Autenticidad",
              "Progreso",
              "Empatía",
              "Líder",
              "Cercanía",
              "Tecnología",
            ].map((v) => (
              <li key={v} className="rounded-full bg-slate-100 px-2.5 py-1">
                {v}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

