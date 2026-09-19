export interface CurrencyConfig {
  code: string;
  name: string;
  singular: string;
  plural: string;
  centSingular: string;
  centPlural: string;
  symbol: string;
  financialSuffix: string;
  flag: string;
  country: string;
  region: "north-central" | "south" | "europe";
  defaultBank?: string;
}

export const CURRENCIES: CurrencyConfig[] = [
  {
    code: "MXN",
    name: "Peso Mexicano",
    singular: "peso",
    plural: "pesos",
    centSingular: "centavo",
    centPlural: "centavos",
    symbol: "$",
    financialSuffix: "M.N.",
    flag: "🇲🇽",
    country: "México",
    region: "north-central",
    defaultBank: "NOMBRE DEL BANCO"
  },
  {
    code: "USD",
    name: "Dólar Americano",
    singular: "dólar",
    plural: "dólares",
    centSingular: "centavo",
    centPlural: "centavos",
    symbol: "$",
    financialSuffix: "USD",
    flag: "🇺🇸",
    country: "EE.UU.",
    region: "north-central",
    defaultBank: "NOMBRE DEL BANCO"
  },
  {
    code: "EUR",
    name: "Euro",
    singular: "euro",
    plural: "euros",
    centSingular: "céntimo",
    centPlural: "céntimos",
    symbol: "€",
    financialSuffix: "",
    flag: "🇪🇺",
    country: "Europa",
    region: "europe",
    defaultBank: "NOMBRE DEL BANCO"
  },
  {
    code: "COP",
    name: "Peso Colombiano",
    singular: "peso",
    plural: "pesos",
    centSingular: "centavo",
    centPlural: "centavos",
    symbol: "$",
    financialSuffix: "M/CTE",
    flag: "🇨🇴",
    country: "Colombia",
    region: "south",
    defaultBank: "NOMBRE DEL BANCO"
  },
  {
    code: "PEN",
    name: "Sol Peruano",
    singular: "sol",
    plural: "soles",
    centSingular: "céntimo",
    centPlural: "céntimos",
    symbol: "S/",
    financialSuffix: "y CTS.",
    flag: "🇵🇪",
    country: "Perú",
    region: "south",
    defaultBank: "NOMBRE DEL BANCO"
  },
  {
    code: "ARS",
    name: "Peso Argentino",
    singular: "peso",
    plural: "pesos",
    centSingular: "centavo",
    centPlural: "centavos",
    symbol: "$",
    financialSuffix: "ARS",
    flag: "🇦🇷",
    country: "Argentina",
    region: "south",
    defaultBank: "NOMBRE DEL BANCO"
  },
  {
    code: "CLP",
    name: "Peso Chileno",
    singular: "peso",
    plural: "pesos",
    centSingular: "centavo",
    centPlural: "centavos",
    symbol: "$",
    financialSuffix: "CLP",
    flag: "🇨🇱",
    country: "Chile",
    region: "south",
    defaultBank: "NOMBRE DEL BANCO"
  },
  {
    code: "VES",
    name: "Bolívar Venezolano",
    singular: "bolívar",
    plural: "bolívares",
    centSingular: "céntimo",
    centPlural: "céntimos",
    symbol: "Bs.S",
    financialSuffix: "V.S.",
    flag: "🇻🇪",
    country: "Venezuela",
    region: "south",
    defaultBank: "NOMBRE DEL BANCO"
  },
  {
    code: "BOB",
    name: "Boliviano",
    singular: "boliviano",
    plural: "bolivianos",
    centSingular: "centavo",
    centPlural: "centavos",
    symbol: "Bs",
    financialSuffix: "BOB",
    flag: "🇧🇴",
    country: "Bolivia",
    region: "south",
    defaultBank: "NOMBRE DEL BANCO"
  },
  {
    code: "GTQ",
    name: "Quetzal Guatemalteco",
    singular: "quetzal",
    plural: "quetzales",
    centSingular: "centavo",
    centPlural: "centavos",
    symbol: "Q",
    financialSuffix: "GTQ",
    flag: "🇬🇹",
    country: "Guatemala",
    region: "north-central",
    defaultBank: "NOMBRE DEL BANCO"
  },
  {
    code: "CRC",
    name: "Colón Costarricense",
    singular: "colón",
    plural: "colones",
    centSingular: "céntimo",
    centPlural: "céntimos",
    symbol: "₡",
    financialSuffix: "CRC",
    flag: "🇨🇷",
    country: "Costa Rica",
    region: "north-central",
    defaultBank: "NOMBRE DEL BANCO"
  },
  {
    code: "HNL",
    name: "Lempira Hondureño",
    singular: "lempira",
    plural: "lempiras",
    centSingular: "centavo",
    centPlural: "centavos",
    symbol: "L",
    financialSuffix: "HNL",
    flag: "🇭🇳",
    country: "Honduras",
    region: "north-central",
    defaultBank: "NOMBRE DEL BANCO"
  },
  {
    code: "NIO",
    name: "Córdoba Nicaragüense",
    singular: "córdoba",
    plural: "córdobas",
    centSingular: "centavo",
    centPlural: "centavos",
    symbol: "C$",
    financialSuffix: "NIO",
    flag: "🇳🇮",
    country: "Nicaragua",
    region: "north-central",
    defaultBank: "NOMBRE DEL BANCO"
  },
  {
    code: "PYG",
    name: "Guaraní Paraguayo",
    singular: "guaraní",
    plural: "guaraníes",
    centSingular: "centavo",
    centPlural: "centavos",
    symbol: "₲",
    financialSuffix: "PYG",
    flag: "🇵🇾",
    country: "Paraguay",
    region: "south",
    defaultBank: "NOMBRE DEL BANCO"
  },
  {
    code: "UYU",
    name: "Peso Uruguayo",
    singular: "peso",
    plural: "pesos",
    centSingular: "centésimo",
    centPlural: "centésimos",
    symbol: "$U",
    financialSuffix: "UYU",
    flag: "🇺🇾",
    country: "Uruguay",
    region: "south",
    defaultBank: "NOMBRE DEL BANCO"
  },
  {
    code: "DOP",
    name: "Peso Dominicano",
    singular: "peso",
    plural: "pesos",
    centSingular: "centavo",
    centPlural: "centavos",
    symbol: "RD$",
    financialSuffix: "DOP",
    flag: "🇩🇴",
    country: "R. Dom.",
    region: "north-central",
    defaultBank: "NOMBRE DEL BANCO"
  }
];

export const CURRENCY_MAP: Record<string, CurrencyConfig> = CURRENCIES.reduce((acc, curr) => {
  acc[curr.code] = curr;
  return acc;
}, {} as Record<string, CurrencyConfig>);

export const DEFAULT_CURRENCY = CURRENCY_MAP["MXN"];

export function getCurrencyConfig(code: string): CurrencyConfig {
  return CURRENCY_MAP[code] || DEFAULT_CURRENCY;
}
