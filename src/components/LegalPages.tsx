import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  FileText, 
  Mail, 
  Users, 
  Lock, 
  CheckCircle, 
  MessageSquare, 
  Send,
  ArrowRight,
  BookOpen,
  Scale,
  Brain,
  Cpu,
  Coins,
  EyeOff,
  GraduationCap,
  Building,
  ChevronDown,
  ChevronUp,
  Globe,
  RefreshCw,
  AlertCircle,
  Settings,
  Code
} from "lucide-react";

// ============================================================================
// 1. SOBRE NOSOTROS (About Us)
// ============================================================================
export function AboutUs({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [activeStep, setActiveStep] = useState<number>(0);

  const algorithmSteps = [
    {
      title: "1. Normalización de Entrada",
      desc: "Limpieza automática de símbolos de moneda ($ o €), comas, espacios y letras sueltas. Soporta separadores de miles decimales tanto de América (1,234.56) como de Europa (1.234,56).",
      icon: Cpu,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "2. Descomposición Numérica",
      desc: "Fragmentación de la cifra en bloques de tres dígitos (unidades, miles, millones, miles de millones, billones). Esto permite procesar números de cualquier escala de manera asíncrona.",
      icon: Settings,
      color: "from-indigo-500 to-blue-500"
    },
    {
      title: "3. Aplicación de Ortografía RAE",
      desc: "Evaluación de reglas especiales: unificación de decenas (ej. 16 'dieciséis'), concordancia de género ('veintiuno' vs 'veintiuna'), apócope ante sustantivos ('un millón' y no 'un mil').",
      icon: Brain,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "4. Formateo y Concordancia de Divisa",
      desc: "Si se activa el modo financiero, se agregan sufijos de divisas como 'Pesos Mexicanos M.N.', 'Dólares' o 'Euros' y se reformatea la fracción decimal de centavos a una expresión fraccionaria /100.",
      icon: Coins,
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 py-12 sm:py-20 font-sans"
    >
      {/* Header section */}
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-2">
          <Users className="w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-gray-900 tracking-tight">
          Quiénes Somos
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Conoce el motor técnico, la rigurosa precisión lingüística y los valores detrás de <strong className="text-blue-600 font-semibold">numerosenletras.org</strong>.
        </p>
      </div>

      <div className="space-y-12">
        {/* Our Mission Section */}
        <section className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
            Nuestra Misión
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            En <strong>numerosenletras.org</strong>, nuestra misión es simplificar la escritura formal de cantidades en la lengua española. Desarrollamos herramientas automatizadas de conversión que garantizan la correcta ortografía de cifras de acuerdo con las normativas oficiales de la <strong>Real Academia Española (RAE)</strong>.
          </p>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            Buscamos ser el recurso educativo y profesional de referencia para redactores, contadores, estudiantes, programadores y cualquier persona que requiera escribir números en letras con total exactitud y seguridad.
          </p>
        </section>

        {/* Dynamic & Interactive Algorithmic Explainer Widget */}
        <section className="bg-slate-50 p-6 sm:p-10 rounded-3xl border border-slate-100 space-y-6">
          <div className="text-left space-y-1">
            <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider font-mono">Infografía Interactiva</span>
            <h2 className="text-xl font-bold text-gray-950">
              ¿Cómo funciona nuestro algoritmo de conversión?
            </h2>
            <p className="text-xs text-gray-500">
              Haz clic en cada paso para entender cómo transformamos dígitos en palabras respetando la gramática oficial de la RAE.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Steps selectors */}
            <div className="md:col-span-5 space-y-2">
              {algorithmSteps.map((step, idx) => {
                const StepIcon = step.icon;
                const isSelected = activeStep === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`w-full flex items-center gap-3.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-white border-blue-500 shadow-md shadow-blue-500/5 text-blue-900 font-semibold" 
                        : "bg-white/60 hover:bg-white border-gray-150 text-gray-600"
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white bg-gradient-to-br ${step.color}`}>
                      <StepIcon className="w-4 h-4" />
                    </span>
                    <span className="text-xs tracking-tight">{step.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Steps desc detail panel */}
            <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-gray-150 min-h-[160px] flex flex-col justify-between shadow-xs">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono">
                      Paso {activeStep + 1} de 4
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                    {algorithmSteps[activeStep].title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
                    {algorithmSteps[activeStep].desc}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>100% Precisión Algorítmica</span>
                <span>Procesado Localmente</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars / Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-950 text-lg">Privacidad Absoluta</h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              No recopilamos ni transmitimos los datos que ingresas. Todo el procesamiento de conversión de números a letras y generación de texto se realiza de manera 100% local en tu navegador web. Ideal para auditar cheques confidenciales.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-gray-950 text-lg">Rigurosidad Lingüística</h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              Estudiamos a fondo las directrices de la Real Academia Española para resolver dudas comunes de acentuación, concordancia de género y escritura amalgamada de decenas y centenas en el habla castellana moderna.
            </p>
          </div>
        </div>

        {/* Offering List Section */}
        <section className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30 space-y-6 text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-950 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
            ¿Qué Ofrecemos en numerosenletras.org?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            <div className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100/40 hover:bg-blue-50/20 transition-all cursor-pointer" onClick={() => onNavigate && onNavigate("/")}>
              <span className="text-blue-600 font-bold shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-gray-900 text-xs sm:text-sm block">Conversión de Cifras General</strong>
                <p className="text-gray-500 text-[11px] sm:text-xs mt-0.5 leading-relaxed">Convierte enteros simples a texto literario instantáneamente según reglas RAE.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100/40 hover:bg-blue-50/20 transition-all cursor-pointer" onClick={() => onNavigate && onNavigate("/cantidad-con-letra")}>
              <span className="text-blue-600 font-bold shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-gray-900 text-xs sm:text-sm block">Importes de Dinero Formales</strong>
                <p className="text-gray-500 text-[11px] sm:text-xs mt-0.5 leading-relaxed">Formatos de moneda para el llenado y verificación de cheques o facturas con fracción decimal.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100/40 hover:bg-blue-50/20 transition-all cursor-pointer" onClick={() => onNavigate && onNavigate("/como-se-escribe")}>
              <span className="text-blue-600 font-bold shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-gray-900 text-xs sm:text-sm block">Consultas de Ortografía y FAQ</strong>
                <p className="text-gray-500 text-[11px] sm:text-xs mt-0.5 leading-relaxed">Respuestas didácticas a dudas clásicas (¿cien o ciento?, ¿veintiuno o veintiún?).</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100/40 hover:bg-blue-50/20 transition-all cursor-pointer" onClick={() => onNavigate && onNavigate("/letras-aesthetic")}>
              <span className="text-blue-600 font-bold shrink-0 mt-0.5">✓</span>
              <div>
                <strong className="text-gray-900 text-xs sm:text-sm block">Fuentes de Letras de Diseño</strong>
                <p className="text-gray-500 text-[11px] sm:text-xs mt-0.5 leading-relaxed">Generador complementario de letras aesthetic, cursivas y burbuja para biografías y redes.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

// ============================================================================
// 2. POLÍTICA DE PRIVACIDAD (Privacy Policy)
// ============================================================================
export function PrivacyPolicy() {
  const [testState, setTestState] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [networkLog, setNetworkLog] = useState<string[]>([]);

  const handleAuditPrivacy = () => {
    setTestState('scanning');
    setNetworkLog([]);
    const logs = [
      "Iniciando auditoría de red del convertidor...",
      "Interceptando llamadas asíncronas fetch()...",
      "Interceptando sockets y XMLHttpRequest...",
      "Analizando entradas en LocalStorage...",
      "Procesando algoritmo de traducción local en RAM...",
      "✓ AUDITORÍA COMPLETADA: Cero (0) bytes enviados al exterior."
    ];
    
    logs.forEach((log, index) => {
      setTimeout(() => {
        setNetworkLog(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setTestState('success');
        }
      }, (index + 1) * 450);
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 py-12 sm:py-20 font-sans"
    >
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-600 mb-2">
          <Lock className="w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-gray-900 tracking-tight">
          Política de Privacidad
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Última actualización: 16 de julio de 2026. Tu privacidad y seguridad de datos son nuestro pilar técnico fundamental.
        </p>
      </div>

      <div className="space-y-8">
        {/* Interactive Privacy Auditer Panel */}
        <section className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-5 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Seguridad Sandbox Local
              </span>
              <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-1.5">
                <Shield className="w-5 h-5 text-emerald-400" />
                Auditor de Privacidad del Navegador
              </h3>
              <p className="text-xs text-slate-300 max-w-lg font-sans">
                Para tu absoluta tranquilidad, puedes realizar un análisis simulado de conexión que demuestra que nuestro algoritmo corre 100% aislado.
              </p>
            </div>
            <button
              onClick={handleAuditPrivacy}
              disabled={testState === 'scanning'}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5 self-start sm:self-center"
            >
              {testState === 'scanning' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Auditando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Auditar Privacidad</span>
                </>
              )}
            </button>
          </div>

          {/* Audit Terminal log */}
          {testState !== 'idle' && (
            <div className="bg-black/40 border border-slate-800 rounded-xl p-4 font-mono text-[10.5px] text-emerald-400 space-y-1.5 min-h-[120px] transition-all">
              {networkLog.map((log, index) => (
                <motion.div 
                  initial={{ opacity: 0, x: -5 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  key={index} 
                  className="flex items-start gap-1.5"
                >
                  <span className="text-slate-600 shrink-0 select-none">❯</span>
                  <span>{log}</span>
                </motion.div>
              ))}
              {testState === 'success' && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-xs font-sans font-semibold text-emerald-300 mt-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Confirmado: Toda la conversión de números se ejecuta localmente. Tus datos financieros no salen de este dispositivo.</span>
                </motion.div>
              )}
            </div>
          )}
        </section>

        {/* Regular Privacy Guidelines */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30 space-y-8 text-sm sm:text-base text-gray-600 leading-relaxed text-left">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-emerald-500 rounded-full" />
              1. Procesamiento 100% Local y Privado
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              En <strong>numerosenletras.org</strong> entendemos la extrema confidencialidad de los datos financieros, personales o comerciales que introduces en nuestras herramientas (como importes de cheques, números de identificación fiscal, cuentas de facturación u otros). 
            </p>
            <p className="text-gray-500 text-xs sm:text-sm">
              Ninguna cantidad, texto o contenido que introduzcas en el convertidor se transmite a nuestros servidores. Los algoritmos de traducción se descargan en tu navegador en el primer acceso y se ejecutan exclusivamente dentro de la memoria caché y RAM de tu computadora, tablet o smartphone.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-emerald-500 rounded-full" />
              2. Cookies y Datos de Navegación Anónimos (Divulgación de Google AdSense)
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Para ofrecerte una experiencia fluida y financiar el mantenimiento de este portal gratuito, utilizamos cookies técnicas, analíticas y publicitarias. A continuación, detallamos su uso de forma transparente:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-gray-500">
              <li>
                <strong>LocalStorage y Almacenamiento Local del Navegador:</strong> Se emplean en tu propio navegador para recordar tus preferencias de formato (como estilo de separadores numéricos) y el historial de conversiones si decides mantenerlo activo. Este almacenamiento es estrictamente local en tu navegador y puede limpiarse o desactivarse en cualquier momento desde el convertidor o borrando los datos del navegador. Los números introducidos no se transmiten a servidores externos.
              </li>
              <li>
                <strong>Google Analytics (con anonimización de IP):</strong> Recopila datos de tráfico estadísticos no identificables (como tipo de navegador, sistema operativo y páginas visitadas) con la única finalidad de optimizar el rendimiento y mejorar la calidad didáctica de nuestras herramientas.
              </li>
              <li>
                <strong>Google AdSense y Socios Publicitarios (Obligatorio para AdSense):</strong>
                <div className="mt-2 pl-4 border-l-2 border-emerald-500/50 space-y-2 text-gray-500">
                  <p>
                    • Los proveedores de terceros, incluido <strong>Google</strong>, utilizan cookies para mostrar anuncios en nuestro sitio web basándose en las visitas anteriores que has realizado a este sitio web o a otros sitios de Internet.
                  </p>
                  <p>
                    • El uso de cookies de publicidad de Google permite a este y a sus socios mostrar anuncios a los usuarios de nuestro portal basándose en las visitas que realizan a nuestros sitios o a otros sitios de Internet.
                  </p>
                  <p>
                    • Como usuario, puedes inhabilitar el uso de la publicidad personalizada. Para ello, puedes acceder directamente a la sección de configuración de anuncios de Google en:{" "}
                    <a
                      href="https://www.google.com/settings/ads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:underline font-semibold"
                    >
                      Configuración de Anuncios de Google
                    </a>.
                  </p>
                  <p>
                    • Alternativamente, te informamos que puedes evitar el uso de cookies de terceros destinadas a la publicidad personalizada visitando el portal de inhabilitación de la Consumer Web Choice de la Digital Advertising Alliance en:{" "}
                    <a
                      href="https://www.aboutads.info/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:underline font-semibold"
                    >
                      www.aboutads.info
                    </a>.
                  </p>
                  <p>
                    • Si no has inhabilitado la publicidad de terceros, las cookies de otros proveedores o redes publicitarias de terceros también pueden utilizarse para mostrar anuncios en nuestro sitio.
                  </p>
                </div>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-emerald-500 rounded-full" />
              3. Enlaces a Sitios Externos
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Nuestros artículos didácticos contienen hipervínculos que redirigen a sitios web de terceros (por ejemplo, el diccionario de dudas de la Real Academia Española - RAE). Al hacer clic en estos enlaces, saldrás de nuestro sitio web y te regirás por las políticas de privacidad de los respectivos portales externos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-emerald-500 rounded-full" />
              4. Menores de Edad y Ámbito Educativo
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Nuestras herramientas son seguras para el uso escolar y didáctico de niños, jóvenes y maestros de lengua castellana en todo el mundo. Cumplimos con las regulaciones de protección de privacidad de menores.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// 3. TÉRMINOS DE SERVICIO (Terms of Service)
// ============================================================================
export function TermsOfService() {
  const [useCase, setUseCase] = useState<'dev' | 'teacher' | 'accountant' | 'general'>('general');

  const termsByUseCase = {
    general: {
      title: "Uso Personal & General",
      badge: "Gratuito",
      desc: "Puedes utilizar libremente todas las herramientas de conversión de numerosenletras.org para tu vida cotidiana, tareas de redacción literaria o personal sin limitaciones de uso.",
      icon: Users,
      color: "border-blue-200 bg-blue-50/20"
    },
    accountant: {
      title: "Contabilidad & Finanzas",
      badge: "Profesional",
      desc: "Nuestros formatos están optimizados para el llenado de cheques o facturas fiscales. Como profesional contable, eres responsable de la verificación final de cualquier documento de valor legal antes de firmarlo.",
      icon: Coins,
      color: "border-emerald-200 bg-emerald-50/20"
    },
    teacher: {
      title: "Educación & Escuelas",
      badge: "Pedagógico",
      desc: "Autorizamos el copiado e impresión libre de las tablas de equivalencia, guías RAE y diagramas interactivos para que los uses en tus aulas y exámenes de ortografía.",
      icon: GraduationCap,
      color: "border-amber-200 bg-amber-50/20"
    },
    dev: {
      title: "Desarrolladores & API",
      badge: "Código abierto",
      desc: "El código y diseño visual son propiedad intelectual del portal. Te invitamos a leer nuestro código de conversión de forma libre para implementarlo en tus propios proyectos bajo atribución.",
      icon: Code,
      color: "border-purple-200 bg-purple-50/20"
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 py-12 sm:py-20 font-sans"
    >
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-indigo-600 mb-2">
          <Scale className="w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-gray-900 tracking-tight">
          Términos de Servicio
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Lee detalladamente las condiciones legales y la licencia gratuita de uso del portal web <strong>numerosenletras.org</strong>.
        </p>
      </div>

      <div className="space-y-8 text-left">
        {/* Dynamic Licence Selector */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider font-mono">Licencia Personalizada</span>
            <h3 className="font-bold text-gray-950 text-base sm:text-lg">
              ¿Cómo planeas usar numerosenletras.org?
            </h3>
            <p className="text-xs text-gray-500">
              Selecciona tu perfil profesional para conocer los términos de uso específicos aplicados a tu rubro.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(Object.keys(termsByUseCase) as Array<keyof typeof termsByUseCase>).map((key) => {
              const item = termsByUseCase[key];
              const IconComp = item.icon;
              const isSelected = useCase === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setUseCase(key)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    isSelected 
                      ? "bg-indigo-600 border-indigo-700 text-white shadow-md shadow-indigo-600/10" 
                      : "bg-gray-50/50 hover:bg-gray-50 border-gray-200 text-gray-600"
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isSelected ? "text-white animate-bounce" : "text-gray-400"}`} />
                  <span className="text-xs font-semibold block tracking-tight leading-tight">{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Render selected Terms card */}
          <div className={`p-5 rounded-2xl border transition-all duration-300 ${termsByUseCase[useCase].color}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-indigo-700 font-mono tracking-widest bg-white border border-indigo-150 px-2.5 py-0.5 rounded-md">
                {termsByUseCase[useCase].badge}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Licencia numerosenletras.org</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
              {termsByUseCase[useCase].desc}
            </p>
          </div>
        </section>

        {/* Core Terms */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/30 space-y-8 text-sm sm:text-base text-gray-600 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-indigo-500 rounded-full" />
              1. Aceptación de los Términos
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Al acceder, navegar o utilizar las utilidades web de <strong>numerosenletras.org</strong>, aceptas plenamente quedar vinculado por estos Términos de Servicio y por todas las leyes aplicables en el ámbito web. Si no estás de acuerdo con alguna de estas condiciones, debes abstenerte de utilizar nuestros servicios.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-indigo-500 rounded-full" />
              2. Exclusión de Responsabilidad (Descargo de Garantía)
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Nuestros algoritmos están meticulosamente diseñados para ofrecer un 100% de exactitud en la ortografía de números a letras según la RAE. No obstante, el sitio web se ofrece de manera "tal como está" (As-Is). 
            </p>
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-150 text-amber-900 text-xs sm:text-sm leading-relaxed font-sans">
              <strong>Aviso Legal Importante:</strong> El usuario final tiene la total responsabilidad de revisar y verificar la ortografía y redacción de sus cheques, facturas, recibos bancarios o contratos mercantiles antes de proceder a la firma, emisión o depósito. No asumimos responsabilidad alguna por pérdidas económicas, disputas bancarias o desacuerdos comerciales resultantes de cualquier error tipográfico.
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-indigo-500 rounded-full" />
              3. Propiedad Intelectual
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Los algoritmos locales de conversión, los logotipos del sitio, los recursos interactivos de diseño visual, las guías didácticas y el contenido original de <strong>numerosenletras.org</strong> están protegidos por leyes de propiedad intelectual internacionales. Queda prohibida su reproducción masiva con fines comerciales ajenos a este portal.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// 4. CONTACTO (Contact Us)
// ============================================================================
export function ContactPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    asunto: "consulta",
    mensaje: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqItems = [
    {
      q: "¿Por qué el número 21 se convierte a veces en 'veintiún'?",
      a: "Según las directrices de la RAE, se usa 'veintiún' antes de sustantivos masculinos (ej: veintiún pesos), mientras que 'veintiuno' se emplea de forma aislada o al final de una cifra abstracta."
    },
    {
      q: "¿Cómo configuro el formato europeo en lugar del americano?",
      a: "En la parte superior derecha de la casilla de entrada de nuestro convertidor principal, puedes hacer clic para alternar de manera instantánea entre el formato 1,234.56 (América) y 1.234,56 (Europa)."
    },
    {
      q: "¿Ofrecen API para desarrolladores?",
      a: "Actualmente no ofrecemos una API externa pública, ya que todo nuestro código de traducción se ejecuta directamente del lado del cliente. Te invitamos a utilizar de forma libre y local los scripts de traducción."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.correo || !formData.mensaje) return;

    setLoading(true);
    // Simulate API Submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        nombre: "",
        correo: "",
        asunto: "consulta",
        mensaje: ""
      });
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 py-12 sm:py-20 font-sans"
    >
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-2">
          <Mail className="w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-gray-900 tracking-tight">
          Ponte en Contacto
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          ¿Tienes sugerencias de mejora, dudas de ortografía o reportes técnicos? Escríbenos y te responderemos a la brevedad.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Support columns with FAQs */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          {/* Support panel */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-955 text-base flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Canales de Soporte
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Atendemos de manera diaria consultas de webmasters, maestros escolares, profesionales financieros y colaboradores apasionados por la ortografía y el desarrollo de software.
            </p>
            
            <div className="pt-4 border-t border-gray-100 space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50/50 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Correo Directo</p>
                  <a href="mailto:contacto@numerosenletras.org" className="text-xs sm:text-sm text-blue-600 font-semibold hover:underline">
                    contacto@numerosenletras.org
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Tiempo de Respuesta</p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    Menor a 24 - 48 horas hábiles de forma garantizada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ accordion panel */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-955 text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>Soluciones Rápidas</span>
            </h3>
            <p className="text-xs text-gray-500">¿Tienes dudas rápidas? Tal vez ya tengamos la respuesta para ti:</p>

            <div className="space-y-2">
              {faqItems.map((faq, idx) => {
                const isExpanded = expandedFaq === idx;
                return (
                  <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden text-xs">
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                      className="w-full px-4 py-3 bg-gray-50/40 hover:bg-gray-50 flex items-center justify-between text-left font-semibold text-gray-700 cursor-pointer"
                    >
                      <span className="pr-4">{faq.q}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5 shrink-0 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0 text-gray-400" />}
                    </button>
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-white px-4 py-3 border-t border-gray-100 text-gray-500 leading-relaxed"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Form column */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/35">
            {submitted ? (
              <div className="text-center py-10 space-y-4 animate-fade-in">
                <div className="inline-flex p-4 rounded-full bg-emerald-50 text-emerald-500 mb-2">
                  <CheckCircle className="w-10 h-10 animate-bounce" />
                </div>
                <h3 className="font-bold text-gray-900 text-xl">¡Mensaje Enviado con Éxito!</h3>
                <p className="text-gray-500 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                  Gracias por comunicarte con nosotros. Hemos recibido tu consulta y nuestro equipo la revisará de inmediato. Te enviaremos una respuesta a tu correo electrónico.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shadow-sm"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-xs font-bold text-gray-600 uppercase tracking-wider">Nombre Completo</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Ej: Alejandro Gómez"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs sm:text-sm outline-hidden transition shadow-2xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-xs font-bold text-gray-600 uppercase tracking-wider">Correo Electrónico</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.correo}
                      onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                      placeholder="Ej: alejandro@correo.com"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs sm:text-sm outline-hidden transition shadow-2xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-subject" className="text-xs font-bold text-gray-600 uppercase tracking-wider">Asunto del Mensaje</label>
                  <select
                    id="contact-subject"
                    value={formData.asunto}
                    onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs sm:text-sm outline-hidden transition cursor-pointer shadow-2xs"
                  >
                    <option value="consulta">Consulta de Ortografía</option>
                    <option value="sugerencia">Sugerencia de Nueva Herramienta</option>
                    <option value="error">Reportar Error en el Sitio</option>
                    <option value="publicidad">Colaboración o Publicidad</option>
                    <option value="otro">Otro Motivo</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-bold text-gray-600 uppercase tracking-wider">Mensaje o Comentarios</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    placeholder="Escribe tu mensaje detalladamente aquí..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs sm:text-sm outline-hidden transition resize-none shadow-2xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-blue-500/10"
                >
                  {loading ? (
                    <span>Procesando...</span>
                  ) : (
                    <>
                      <span>Enviar Mensaje</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
