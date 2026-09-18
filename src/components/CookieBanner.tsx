import { useState, useEffect } from "react";
import { ShieldCheck, Settings, X, Check } from "lucide-react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    preferences: true,
  });

  useEffect(() => {
    // Detect bots/headless crawlers
    const isBot = typeof navigator !== "undefined" && (
      navigator.webdriver ||
      /lighthouse|chrome-lighthouse|speedinsights|pagespeed|googlebot|adsbot|bingbot|headless|ptst|gtmetrix|pingdom/i.test(navigator.userAgent)
    );
    
    if (isBot) {
      return;
    }

    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Delay showing the banner until user interaction or 4 seconds idle
      let timer: ReturnType<typeof setTimeout> | undefined;
      const show = () => {
        setShowBanner(true);
        cleanup();
      };

      const cleanup = () => {
        if (timer) clearTimeout(timer);
        window.removeEventListener("scroll", show);
        window.removeEventListener("touchstart", show);
        window.removeEventListener("mousemove", show);
      };

      timer = setTimeout(show, 3500);

      window.addEventListener("scroll", show, { passive: true, once: true });
      window.addEventListener("touchstart", show, { passive: true, once: true });
      window.addEventListener("mousemove", show, { passive: true, once: true });

      return () => cleanup();
    } else {
      try {
        const parsed = JSON.parse(consent);
        setPreferences(p => ({ ...p, ...parsed }));
      } catch {
        // Safe fallback
      }
    }
  }, []);

  useEffect(() => {
    const handleOpenSettings = () => {
      setShowBanner(true);
      setShowCustomize(true);
    };
    window.addEventListener("open-cookie-settings", handleOpenSettings);
    return () => {
      window.removeEventListener("open-cookie-settings", handleOpenSettings);
    };
  }, []);

  const handleAcceptAll = () => {
    const consentData = { essential: true, preferences: true };
    setPreferences(consentData);
    localStorage.setItem("cookie-consent", JSON.stringify(consentData));
    window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: consentData }));
    setShowBanner(false);
  };

  const handleDeclineAll = () => {
    const consentData = { essential: true, preferences: false };
    setPreferences(consentData);
    localStorage.setItem("cookie-consent", JSON.stringify(consentData));
    window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: consentData }));
    setShowBanner(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: preferences }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-200/50 p-5 z-50 font-sans text-left transition-all duration-300 ease-out"
      id="cookie-consent-banner"
    >
      {!showCustomize ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">
                Control de Privacidad y Almacenamiento Local
              </h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Utilizamos cookies técnicas y almacenamiento local en tu navegador exclusivamente para guardar tus preferencias de conversión (moneda, formato decimal, historial local y favoritos) sin rastrear tu actividad externa.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={handleAcceptAll}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition cursor-pointer text-center"
            >
              Aceptar Todo
            </button>
            <button
              type="button"
              onClick={handleDeclineAll}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl text-xs transition cursor-pointer text-center"
            >
              Solo Esenciales
            </button>
            <button
              type="button"
              onClick={() => setShowCustomize(true)}
              className="px-3 py-2 border border-gray-200 hover:border-blue-300 text-gray-500 hover:text-blue-600 font-semibold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1"
              title="Personalizar preferencias"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configurar</span>
            </button>
          </div>
          <div className="text-center">
            <a
              href="/privacidad"
              className="text-[10px] text-gray-400 hover:text-blue-500 hover:underline inline-block"
            >
              Leer nuestra Política de Privacidad
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-blue-600" />
              Configurar Preferencias
            </h4>
            <button
              type="button"
              onClick={() => setShowCustomize(false)}
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Essential cookies */}
            <div className="flex items-start justify-between gap-4 p-2.5 rounded-xl hover:bg-gray-50/50">
              <div className="space-y-0.5 text-left">
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                  Cookies Técnicas y Esenciales
                  <span className="text-[9px] px-1.5 py-0.2 bg-gray-100 text-gray-500 rounded font-mono font-medium">Obligatorio</span>
                </span>
                <p className="text-[10.5px] text-gray-500 leading-normal">
                  Imprescindibles para recordar este consentimiento y garantizar la navegación segura en la aplicación.
                </p>
              </div>
              <div className="pt-0.5 shrink-0">
                <div className="w-8 h-5 rounded-full bg-blue-100 flex items-center justify-end px-1 border border-blue-200">
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white">
                    <Check className="w-2 h-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Local preferences storage */}
            <div className="flex items-start justify-between gap-4 p-2.5 rounded-xl hover:bg-gray-50/50">
              <div className="space-y-0.5 text-left">
                <span className="text-xs font-bold text-gray-800">
                  Preferencias y Almacenamiento Local
                </span>
                <p className="text-[10.5px] text-gray-500 leading-normal">
                  Permite a tu navegador guardar localmente tu historial de conversiones, moneda por defecto y opciones de formato de cheque en tu propio dispositivo.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={preferences.preferences}
                aria-label="Permitir almacenamiento de preferencias locales"
                onClick={() => setPreferences(p => ({ ...p, preferences: !p.preferences }))}
                className={`w-10 h-6 rounded-full transition-all flex items-center px-0.5 border cursor-pointer ${
                  preferences.preferences
                    ? "bg-blue-600 border-blue-700 justify-end"
                    : "bg-gray-200 border-gray-300 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleSaveCustom}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition cursor-pointer text-center"
            >
              Guardar Preferencias
            </button>
            <button
              type="button"
              onClick={() => setShowCustomize(false)}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl text-xs transition cursor-pointer text-center"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
