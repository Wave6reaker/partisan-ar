"use client";

import React, { useEffect, useState, useRef } from "react";
import { Product } from "@/lib/data";
import { Camera, Maximize, RotateCw, Loader2, Box, Info } from "lucide-react";

// Dynamically import types for @google/model-viewer if needed
// but we usage through custom element definition in types/model-viewer.d.ts

interface ARShowroomProps {
  initialProduct: Product;
  products: Product[];
}

export default function ARShowroom({ initialProduct, products }: ARShowroomProps) {
  const [activeProduct, setActiveProduct] = useState<Product>(initialProduct);
  const [isLoading, setIsLoading] = useState(true);
  const [arSupported, setArSupported] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      setWebglSupported(!!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))));
    } catch (e) {
      setWebglSupported(false);
    }

    import("@google/model-viewer").then(() => {
      const checkAR = () => {
        if (modelViewerRef.current) {
          setArSupported(modelViewerRef.current.canActivateAR);
        }
      };
      const interval = setInterval(checkAR, 1000);
      return () => clearInterval(interval);
    }).catch(console.error);
  }, []);

  const handleProductChange = (product: Product) => {
    if (product.id === activeProduct.id) return;
    setIsLoading(true);
    setActiveProduct(product);
  };

  const startAR = () => {
    if (modelViewerRef.current) {
      // Direct activation for AR
      modelViewerRef.current.activateAR().catch((err: any) => {
        console.error("AR Launch failed", err);
      });
    }
  };

  const enterShowroom = (withAR = false) => {
    if (withAR) startAR();
    setShowIntro(false);
  };

  if (!webglSupported) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold text-red-500 mb-4">Ошибка графики</h2>
        <p className="text-sm text-gray-600 mb-6">Ваш браузер заблокировал WebGL. Пожалуйста, откройте сайт в Chrome или Safari и отключите режим энергосбережения.</p>
        <button onClick={() => window.location.reload()} className="bg-black text-white px-8 py-3 rounded-full">Обновить</button>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-[100dvh] bg-white overflow-hidden">
      {/* Intro Overlay */}
      {showIntro && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 animate-fade-in shadow-2xl">
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <h1 className="text-4xl font-black tracking-tighter text-center mb-12 italic">PARTISAN</h1>
            
            <button 
              onClick={() => enterShowroom(false)}
              className="w-full bg-[#f5f5f5] text-black py-6 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-sm"
            >
              Посмотреть 3D
            </button>

            <button 
              onClick={() => enterShowroom(true)}
              className="w-full bg-black text-white py-6 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3"
            >
              <Camera className="w-5 h-5" />
              Посмотреть в VR / AR
            </button>

            {isLoading && (
              <p className="text-[9px] text-center text-black/20 font-bold uppercase tracking-widest mt-4">
                Загрузка окружения...
              </p>
            )}
          </div>
        </div>
      )}

      {/* 3D/AR Viewer - Ultra Light Settings */}
      <model-viewer
        ref={modelViewerRef}
        src={activeProduct.glb}
        ios-src={activeProduct.usdz}
        alt={activeProduct.name}
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="fixed"
        ar-placement="floor"
        camera-controls
        auto-rotate
        shadow-intensity="0"
        exposure="1"
        power-preference="high-performance"
        className={`w-full h-full relative z-10 transition-opacity duration-1000 ${showIntro ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setIsLoading(false)}
      >
        <button slot="ar-button" className="hidden" />
      </model-viewer>

      {/* MINIMAL OVERLAY */}
      {!showIntro && (
        <div className="absolute inset-x-0 bottom-12 z-20 pointer-events-none flex flex-col items-center gap-8 animate-fade-in-up">
          <div className="pointer-events-auto flex items-center gap-1 bg-black/90 backdrop-blur-xl p-1 rounded-full shadow-2xl border border-white/5 mx-4">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-1 max-w-[90vw]">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductChange(product)}
                  className={`flex-shrink-0 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                    activeProduct.id === product.id
                      ? "bg-white text-black"
                      : "text-white/30"
                  }`}
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => setShowIntro(true)}
            className="pointer-events-auto opacity-20 hover:opacity-100 transition-opacity"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>
      )}

      {isLoading && !showIntro && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-[60]">
          <Loader2 className="w-4 h-4 animate-spin text-black/10" />
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
