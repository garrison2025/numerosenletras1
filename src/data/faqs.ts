export interface FAQItem {
  q: string;
  a: string;
}

export const HOME_FAQS: FAQItem[] = [
  {
    q: "¿Cómo se escriben los centavos o céntimos con letras?",
    a: "Según la Real Academia Española (RAE) y la práctica financiera habitual, en cheques y documentos bancarios se utiliza comúnmente la fracción sobre cien (ej. '50/100 M.N.' o '50/100 USD') para evitar ambigüedades. En redacción literaria o formal continua, se expresan en palabras completas (ej. 'cincuenta centavos' o 'cincuenta céntimos')."
  },
  {
    q: "¿Cuál es la diferencia entre 'ciento' y 'cien' al escribir números?",
    a: "Se emplea 'cien' exclusivamente para la centena exacta (100). Cuando el número va acompañado de decenas o unidades menores, adopta obligatoriamente la forma 'ciento' (ej. 'ciento uno', 'ciento cincuenta')."
  },
  {
    q: "¿A partir de qué número se separan las cifras con la conjunción 'y'?",
    a: "Los números del 0 al 30 se escriben siempre en una sola palabra continua (ej. 'dieciséis', 'veintidós', 'veintiséis'). A partir del número 31 en adelante, las decenas y las unidades se separan con la conjunción 'y' (ej. 'treinta y uno', 'cuarenta y cinco')."
  },
  {
    q: "¿Por qué la cantidad en letras de un cheque suele tener prioridad sobre el número?",
    a: "En algunos ordenamientos jurídicos, cuando un documento o título contiene una cantidad escrita en palabras y otra en cifras y ambas difieren, la normativa aplicable puede dar prevalencia al importe escrito en palabras como salvaguarda frente a alteraciones. No obstante, las reglas concretas varían según la legislación de cada país y los requisitos bancarios locales, por lo que siempre conviene consultar la normativa aplicable."
  },
  {
    q: "¿Este conversor guarda mis datos o funciona en el navegador?",
    a: "El conversor se ejecuta localmente en el navegador del usuario. Los números introducidos no se envían a nuestros servidores. El historial de conversiones puede almacenarse de manera local en el propio dispositivo del usuario, con opciones para borrarlo o desactivarlo en cualquier momento."
  }
];
