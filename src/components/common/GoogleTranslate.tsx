"use client";

import { useEffect, useRef } from "react";
import { Languages } from "lucide-react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function GoogleTranslate() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,fr,fa,ur,ar,es,zh-CN,it,de",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    const addScript = () => {
      const script = document.createElement("script");
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    if (!document.querySelector('script[src*="translate.google.com"]')) {
      addScript();
    }

    initialized.current = true;
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group text-white">
      <Languages className="h-4 w-4 text-white group-hover:rotate-12 transition-transform" />
      <div id="google_translate_element" className="google-translate-container text-white" />
      
      <style jsx global>{`
        .google-translate-container {
          height: 24px;
          overflow: hidden;
        }
        .goog-te-gadget-simple {
          background-color: #fff !important;
          border: none !important;
          padding: 0 !important;
          font-family: inherit !important;
          display: flex !important;
          align-items: center !important;
          color: #fff;
        }
        .goog-te-gadget-simple img {
          display: none !important;
        }
        .goog-te-gadget-icon {
          display: none !important;
        }
        .goog-te-menu-value {
          margin: 0 !important;
          color: white !important;
          font-size: 12px !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
        }
        .goog-te-menu-value span {
          border: none !important;
          color: white !important;
        }
        .goog-te-menu-value:after {
          content: '▾';
          color: #c9a84c;
        }
        .goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .goog-te-menu-frame {
          box-shadow: 0 20px 50px rgba(0,0,0,0.3) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 12px !important;
        }
      `}</style>
    </div>
  );
}
