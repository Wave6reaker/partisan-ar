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
  const [showIntro, setShowIntro] = useState(true);
  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    import("@google/model-viewer").then(() => {
      const checkAR = () => {
        if (modelViewerRef.current) {
          setArSupported(modelViewerRef.current.canActivateAR);
        }
      };
      // Check periodically as it might take time to detect
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
      modelViewerRef.current.activateAR();
    }
  };

  const enterShowroom = (withAR = false) => {
    if (withAR) {
      startAR();
    }
    setShowIntro(false);
  };

  return (
    <div className="relative w-screen h-[100dvh] bg-white overflow-hidden">
      {/* Intro Overlay - Always on top until hidden */}
      {showIntro && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 animate-fade-in">
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
              disabled={isLoading}
              className={`w-full py-6 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3 ${
                isLoading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-black text-white active:scale-95"
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Camera className="w-5 h-5" />
              )}
              {isLoading ? "Загрузка..." : "Посмотреть в VR / AR"}
            </button>

            {isLoading && (
              <p className="text-[10px] text-center text-black/20 font-bold uppercase tracking-widest animate-pulse">
                Подготовка иммерсивной среды...
              </p>
            )}
          </div>
        </div>
      )}

      {/* 3D/AR Viewer - Always mounted to preload model */}
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
        shadow-intensity="1"
        exposure="1"
        environment-image="neutral"
        className={`w-full h-full relative z-10 transition-opacity duration-1000 ${showIntro ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setIsLoading(false)}
      >
        <button slot="ar-button" className="hidden" />
        <div slot="progress-bar" className="hidden"></div>
      </model-viewer>

      {/* MINIMAL OVERLAY */}
      {!showIntro && (
        <div className="absolute inset-x-0 bottom-12 z-20 pointer-events-none flex flex-col items-center gap-8 animate-fade-in-up">
          {!isLoading && arSupported && (
            <button
              onClick={startAR}
              className="pointer-events-auto bg-black text-white p-5 rounded-full shadow-2xl active:scale-90 transition-transform"
            >
              <Camera className="w-6 h-6" />
            </button>
          )}

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
          <Loader2 className="w-5 h-5 animate-spin text-black/10" />
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
