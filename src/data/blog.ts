const imgNumerosLetras = "/assets/images/blog_numeros_letras.webp";
const imgLetrasBurbuja = "/assets/images/blog_letras_burbuja.webp";
const imgLetrasAesthetic = "/assets/images/blog_letras_aesthetic.webp";

export const SVG_FALLBACKS: Record<string, string> = {
  "como-convertir-numeros-a-letras": imgNumerosLetras,
  "letras-burbuja-redondas": imgLetrasBurbuja,
  "letras-aesthetic-guia-completa": imgLetrasAesthetic,
};

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  category: "Finanzas" | "Diseño" | "Ortografía";
  keywords: string[];
  content: string;
  image: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "guia-convertir-numeros-a-letras-rae-finanzas",
    title: "Guía Suprema: Cómo Convertir Números a Letras en Español (Normas RAE, Finanzas y Redacción de Cheques)",
    excerpt: "Aprende las reglas ortográficas oficiales de la RAE para escribir cualquier número en letras, expresar cantidades financieras y rellenar cheques de forma impecable.",
    date: "17 de Julio, 2026",
    author: "Comité Editorial Lingüístico",
    readTime: "12 min de lectura",
    category: "Finanzas",
    keywords: ["numeros en letras", "cantidad con letra", "numeros a letras", "convertir numeros a letras", "cómo se escribe con letra", "convertidor de numeros a letras"],
    image: imgNumerosLetras,
    content: `
      <div class="space-y-8 font-sans text-gray-800 leading-relaxed text-base">
        <p class="text-lg text-gray-600 italic border-l-4 border-blue-500 pl-4 py-1">
          La conversión de números a letras en la lengua española es uno de los pilares fundamentales tanto de la ortografía académica como de la seguridad documental y jurídica. Ya sea para la firma de un contrato mercantil de alta envergadura, el llenado formal de un cheque bancario o la redacción de actas notariales, saber redactar con exactitud lingüística y sin margen de ambigüedad las cantidades numéricas es un requisito profesional ineludible.
        </p>

        <p>
          Para resolver estas dudas de forma ágil, el sitio web <a href="https://numerosenletras.org" class="text-blue-600 hover:text-blue-800 font-bold underline">numerosenletras.org</a> provee una plataforma inteligente y gratuita para el procesamiento y traducción automatizada de cualquier cifra. En este extenso artículo, desglosaremos minuciosamente la normativa oficial de la <strong>Real Academia Española (RAE)</strong>, las excepciones prácticas del comercio diario y los estándares para transacciones financieras en todo el mundo hispanohablante.
        </p>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">1. La Regla General de la Escritura de Números en Letras</h2>
          <p class="mb-4">
            La RAE, en su tratado integral sobre la <a href="https://www.rae.es/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline inline-flex items-center gap-1 font-semibold">Ortografía de la lengua española</a>, establece pautas sumamente específicas acerca de la grafía de las cifras. La regla básica para la ortografía de los números cardinales en una sola palabra se resume de la siguiente forma:
          </p>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Números del 0 al 30:</strong> Se escriben siempre en una sola palabra. Ejemplos directos: <em>cero, uno, once, dieciséis, veintiuno, veinticuatro, treinta</em>.</li>
            <li><strong>Números del 31 al 99:</strong> Se escriben utilizando tres palabras separadas por la conjunción copulativa "y", salvo las decenas exactas (<em>cuarenta, cincuenta, sesenta...</em>). Ejemplos: <em>treinta y uno, cuarenta y cinco, noventa y nueve</em>.</li>
            <li><strong>Las Centenas:</strong> Tienen formas especiales de una sola palabra (<em>cien, ciento, doscientos, trescientos, cuatrocientos, quinientos, seiscientos, setecientos, ochocientos, novecientos</em>).</li>
            <li><strong>El número Mil:</strong> Se escribe de forma independiente. Para cifras mayores, se une a las centenas y unidades correspondientes: <em>mil doscientos, diez mil cuatrocientos treinta</em>.</li>
          </ul>
        </div>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">2. El Uso de "Mil" vs "Un Mil" y Millones: Diferencias Lingüísticas y Práctica Financiera</h2>
          <p class="mb-4">
            Según la norma lingüística de la Real Academia Española (RAE), en el uso general del idioma el cardinal correspondiente es simplemente <strong>"mil"</strong> (por ejemplo, <em>"mil personas"</em> o <em>"mil pesos"</em>), considerándose redundante anteponer el numeral <em>un</em> en la lengua ordinaria.
          </p>
          <p class="mb-4">
            No obstante, en el ámbito bancario, mercantil y notarial de varios países hispanohablantes es habitual encontrar la fórmula <strong>"un mil"</strong> en cheques y pagarés. Esta práctica preventiva busca dificultar alteraciones tipográficas o adiciones manuales. Para los millones, en cambio, la norma general siempre exige el numeral: <strong>"un millón"</strong>.
          </p>
          <div class="bg-gray-50 border-l-4 border-indigo-500 p-4 rounded-r-xl my-4">
            <h4 class="font-bold text-indigo-900 mb-1">💡 Práctica habitual en cheques:</h4>
            <p class="text-sm text-gray-700">
              Al rellenar una <span class="underline decoration-indigo-300 font-semibold">cantidad con letra</span> en un cheque, tanto "Mil" como "Un mil" son ampliamente aceptados por entidades financieras según el país. Una recomendación de seguridad adicional es trazar una línea horizontal continua al finalizar el texto para evitar que se añadan palabras en el renglón.
            </p>
          </div>
        </div>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">3. Cómo Expresar Decimales y Monedas con Letras</h2>
          <p class="mb-4">
            Cuando convertimos un importe de dinero que incluye céntimos o centavos, la estructura debe reflejar la moneda local y el sistema de centavos del país en cuestión. Existen dos esquemas principales:
          </p>
          
          <h3 class="text-lg font-bold text-gray-900 mt-4 mb-2">A. El Formato Fraccionario (Estilo de Cheques)</h3>
          <p class="mb-3">
            Ampliamente utilizado en países como México, Perú, Colombia y Argentina. Consiste en escribir la parte entera en letras y la parte decimal mediante una fracción matemática sobre cien (XX/100), seguida de la designación oficial de la moneda nacional o el sufijo correspondiente (ej. "M.N.").
          </p>
          <p class="bg-blue-50/50 p-3 rounded-lg font-mono text-sm text-blue-900 border border-blue-100 mb-4">
            <strong>Ejemplo para $1,450.75:</strong><br/>
            "Mil cuatrocientos cincuenta pesos 75/100 M.N." o "Mil cuatrocientos cincuenta dólares con setenta y cinco centavos".
          </p>

          <h3 class="text-lg font-bold text-gray-900 mt-4 mb-2">B. El Formato Ortográfico Pleno</h3>
          <p class="mb-3">
            Consiste en verter absolutamente todos los términos a texto libre, uniendo ambas partes mediante la preposición "con" o la conjunción "y". Este formato es preferido en contratos formales de arrendamiento o escrituras notariales.
          </p>
          <p class="bg-purple-50/50 p-3 rounded-lg font-mono text-sm text-purple-900 border border-purple-100 mb-4">
            <strong>Ejemplo para €945.50:</strong><br/>
            "Novecientos cuarenta y cinco euros con cincuenta céntimos".
          </p>
        </div>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">4. Los Errores Ortográficos más Comunes que Debes Evitar</h2>
          <p class="mb-4">
            A continuación repasamos las correcciones clave según la normativa académica:
          </p>
          
          <div class="overflow-x-auto my-4 border border-gray-100 rounded-xl">
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="bg-gray-100 text-gray-800 font-bold border-b border-gray-200">
                  <th class="p-3">Número</th>
                  <th class="p-3">Grafía Incorrecta</th>
                  <th class="p-3">Grafía Correcta (RAE)</th>
                  <th class="p-3">Explicación Lingüística</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 text-gray-700">
                <tr>
                  <td class="p-3 font-bold">16</td>
                  <td class="p-3 text-red-600 line-through">dieciseis</td>
                  <td class="p-3 text-emerald-700 font-bold">dieciséis</td>
                  <td class="p-3">Lleva tilde en la 'e' por ser palabra aguda terminada en 's'.</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold">22</td>
                  <td class="p-3 text-red-600 line-through">veintidos</td>
                  <td class="p-3 text-emerald-700 font-bold">veintidós</td>
                  <td class="p-3">Aguda terminada en 's', requiere acento gráfico obligatorio.</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold">23</td>
                  <td class="p-3 text-red-600 line-through">veintitres</td>
                  <td class="p-3 text-emerald-700 font-bold">veintitrés</td>
                  <td class="p-3">Sigue la misma regla de acentuación que las anteriores.</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold">26</td>
                  <td class="p-3 text-red-600 line-through">veintiseis</td>
                  <td class="p-3 text-emerald-700 font-bold">veintiséis</td>
                  <td class="p-3">Palabra aguda terminada en 's', lleva tilde en la vocal abierta 'e'.</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold">100.000</td>
                  <td class="p-3 text-red-600 line-through">cienmil</td>
                  <td class="p-3 text-emerald-700 font-bold">cien mil</td>
                  <td class="p-3">Se escribe en dos palabras separadas (cien mil).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">Conclusión</h2>
          <p class="mb-4">
            Dominar la escritura de las cantidades numéricas y comprender <strong class="text-gray-900">cómo se escribe con letra</strong> cualquier cifra financiera es un conocimiento indispensable que brinda pulcritud, legalidad y claridad a todos sus documentos de valor.
          </p>
        </div>
      </div>
    `
  },
  {
    id: "2",
    slug: "arte-letras-burbuja-tipografia-circular-copiar-pegar",
    title: "El Arte de las Letras Burbuja Ⓑⓤⓡⓑⓤⓙⓐ: Guía de Tipografías Circulares Unicode para Redes Sociales",
    excerpt: "Descubre cómo funciona el sistema de símbolos circulares Unicode, por qué las letras burbuja son tan populares en redes sociales y cómo usarlas para potenciar tu presencia digital.",
    date: "17 de Julio, 2026",
    author: "Especialista en Tipografía Digital",
    readTime: "10 min de lectura",
    category: "Diseño",
    keywords: ["letras burbuja", "letras aesthetic copiar y pegar", "letras pequeñas"],
    image: imgLetrasBurbuja,
    content: `
      <div class="space-y-8 font-sans text-gray-800 leading-relaxed text-base">
        <p class="text-lg text-gray-600 italic border-l-4 border-blue-500 pl-4 py-1">
          Las redes sociales modernas como Instagram, TikTok, Twitter o Discord han democratizado la autoexpresión visual. Debido a que las plataformas restringen la tipografía por defecto, una de las soluciones más populares y llamativas es el uso de las <strong>Letras Burbuja Ⓑⓤⓡⓑⓤⓙⓐ</strong>.
        </p>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">1. La Ciencia Detrás de las Letras Burbuja: El Estándar Unicode</h2>
          <p class="mb-4">
            Un generador de <a href="https://numerosenletras.org/letras-burbuja" class="text-blue-600 hover:text-blue-800 font-semibold underline">letras burbuja</a> mapea las letras normales del alfabeto latino hacia un bloque especial del estándar Unicode denominado <strong>"Alfanuméricos Encirculados" (Enclosed Alphanumerics)</strong>.
          </p>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Letras Burbuja Blancas (A-Z):</strong> Rango Unicode U+24B6 a U+24CF para mayúsculas (Ⓐ, Ⓑ, Ⓒ...) y U+24D0 a U+24E9 para minúsculas (ⓐ, ⓑ, ⓒ...).</li>
            <li><strong>Letras Burbuja Negras (A-Z):</strong> Símbolos negativos encirculados (🅐, 🅑, 🅒...).</li>
            <li><strong>Números Encirculados (0-9):</strong> Representados con círculos tanto transparentes (①, ②, ③...) como de fondo negro sólido (❶, ❷, ❸...).</li>
          </ul>
        </div>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">2. Consejos de Uso en Redes Sociales</h2>
          <p class="mb-4">
            Conserva tu nombre principal y palabras clave centrales en tipografía regular para garantizar la indexación en los buscadores de Instagram y TikTok, y reserva las letras circulares y estéticas para llamadas a la acción, eslóganes o destacar enlaces importantes.
          </p>
        </div>
      </div>
    `
  },
  {
    id: "3",
    slug: "letras-aesthetic-fuentes-pequenas-instagram-tiktok",
    title: "Guía Completa de Letras Aesthetic y Fuentes Pequeñas para Redes Sociales: Personaliza tu Biografía",
    excerpt: "Aprende a transformar tus textos para crear bios de impacto en Instagram, TikTok y Twitter usando letras pequeñas, cursivas y símbolos aesthetic copiar y pegar.",
    date: "17 de Julio, 2026",
    author: "Experta en Estrategia de Contenidos",
    readTime: "11 min de lectura",
    category: "Diseño",
    keywords: ["letras pequeñas", "letras aesthetic copiar y pegar", "convertidor de numeros a letras"],
    image: imgLetrasAesthetic,
    content: `
      <div class="space-y-8 font-sans text-gray-800 leading-relaxed text-base">
        <p class="text-lg text-gray-600 italic border-l-4 border-purple-500 pl-4 py-1">
          Al aterrizar en tu perfil de Instagram o TikTok, la biografía es el primer elemento visual que los usuarios analizan. Diseñar una composición atractiva con <strong>Letras Aesthetic</strong> y <strong>Letras Pequeñas</strong> es ideal para destacar tu estilo personal.
        </p>

        <div class="my-6">
          <h2 class="text-2xl font-bold text-gray-900 border-b pb-2 mb-4">1. Tipos de Letras Aesthetic Populares</h2>
          <ul class="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Letras Cursivas Estéticas (𝓒𝓾𝓻𝓼𝓲𝓿𝓪):</strong> Fluyen de forma orgánica imitando la caligrafía clásica.</li>
            <li><strong>Letras de Doble Trazo (𝔻𝕠𝕓𝕝𝕖):</strong> Variantes de diseño arquitectónico y tiza escolar.</li>
            <li><strong>Letras Pequeñas (ˢᵐᵃˡˡ / 𝖯𝖾𝗊𝗎𝖾𝗇̃𝖺𝗌):</strong> Caracteres en miniatura tipo superíndice o versalitas (small caps).</li>
          </ul>
        </div>
      </div>
    `
  }
];
