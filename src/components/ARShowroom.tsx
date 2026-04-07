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
  const [arSupported, setArSupported] = useState(true);
  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically import the model-viewer script side-effect
    import("@google/model-viewer").then(() => {
      // Check if AR is supported after module is loaded
      if (modelViewerRef.current) {
        const canActivateAR = modelViewerRef.current.canActivateAR;
        setArSupported(!!canActivateAR);
      }
    }).catch((err) =>
      console.error("Failed to load model-viewer", err)
    );
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

  return (
    <div className="relative w-screen h-screen bg-white overflow-hidden text-[#171717] selection:bg-[#171717] selection:text-white">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#f0f0f0_0%,#ffffff_100%)] opacity-50" />

      {/* 3D/AR Viewer */}
      <model-viewer
        ref={modelViewerRef}
        src={activeProduct.glb}
        ios-src={activeProduct.usdz}
        alt={activeProduct.name}
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="fixed"
        camera-controls
        auto-rotate
        shadow-intensity="1.5"
        exposure="0.8"
        environment-image="neutral"
        className="w-full h-full relative z-10"
        onLoad={() => setIsLoading(false)}
      >
        {/* Hidden internal AR button to use custom trigger */}
        <button slot="ar-button" className="hidden" />
        <div slot="progress-bar" className="hidden"></div>
      </model-viewer>

      {/* UI OVERLAY */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 md:p-12">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-start pointer-events-auto animate-fade-in-down">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black tracking-tighter transition-all hover:tracking-widest cursor-default">
              PARTISAN
            </h1>
            <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-[#171717]/30 mt-1">
              Design & Heritage
            </span>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="px-3 py-1 bg-black text-white text-[10px] font-bold rounded-full tracking-widest uppercase">
              Limited Edition
            </div>
            <p className="text-sm font-medium text-[#171717]/40 leading-none mt-2">
              EST. 2026
            </p>
          </div>
        </div>

        {/* CENTER ACTION AREA */}
        <div className="flex flex-col items-center gap-8 animate-fade-in">
          {!isLoading && arSupported && (
            <button
              onClick={startAR}
              className="pointer-events-auto group relative flex items-center justify-center"
            >
              {/* Main Button */}
              <div className="relative bg-black text-white px-10 py-5 rounded-full flex items-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-all duration-500 hover:scale-105 active:scale-95 border border-white/10 overflow-hidden">
                <Camera className="w-6 h-6" />
                <span className="text-lg font-bold tracking-tight">Примерить в AR / VR</span>
              </div>
            </button>
          )}

          {!arSupported && !isLoading && (
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-red-100 flex flex-col items-center gap-2 pointer-events-auto shadow-lg">
              <p className="text-xs font-bold text-red-500 uppercase tracking-widest text-center">
                AR не поддерживается
              </p>
              <p className="text-[10px] text-black/40 text-center max-w-[200px]">
                Попробуйте открыть сайт в Chrome или Safari.
              </p>
            </div>
          )}

          {/* Hint */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#171717]/40 transition-opacity">
            <span>Вращайте модель для обзора</span>
          </div>
        </div>

        {/* BOTTOM BAR: Info & Menu */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 animate-fade-in-up">
          
          {/* Active Product Details */}
          <div className="flex flex-col gap-2 pointer-events-auto bg-white/40 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-xl max-w-xs">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-[#171717]/30">
              <Box className="w-3 h-3" />
              <span>Коллекция 2026</span>
            </div>
            <h2 className="text-2xl font-black leading-tight tracking-tight">
              {activeProduct.name}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xl font-bold">
                {activeProduct.price.toLocaleString("ru-RU")} ₽
              </span>
              <div className="w-px h-4 bg-black/10" />
              <button className="text-[10px] font-bold uppercase underline tracking-tighter hover:text-black/60 transition-colors">
                Подробнее
              </button>
            </div>
          </div>

          {/* Catalog Menu */}
          <div className="pointer-events-auto flex items-center gap-2 bg-black/90 backdrop-blur-md p-2 rounded-[2rem] shadow-2xl overflow-hidden self-center md:self-end">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-2 max-w-[70vw] md:max-w-md">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductChange(product)}
                  className={`flex-shrink-0 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                    activeProduct.id === product.id
                      ? "bg-white text-black shadow-lg scale-100"
                      : "text-white/40 hover:text-white hover:bg-white/5 scale-95"
                  }`}
                >
                  {product.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-[60] transition-opacity duration-1000">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-2 border-black/5 rounded-full" />
              <div className="absolute inset-0 w-20 h-20 border-t-2 border-black rounded-full animate-spin" />
              <Loader2 className="absolute inset-0 m-auto w-6 h-6 animate-pulse text-black" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs font-black uppercase tracking-[0.5em] text-black">Partisan</p>
              <p className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Architecting Space</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Controls for Desktop */}
      <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-6 p-4 bg-white/20 backdrop-blur-sm rounded-full border border-white/10 z-30 transition-all hover:bg-white/40 pointer-events-auto hidden md:flex animate-fade-in">
        <button className="text-black/20 hover:text-black transition-colors" title="Rotate">
          <RotateCw className="w-5 h-5" />
        </button>
        <button className="text-black/20 hover:text-black transition-colors" title="Zoom">
          <Maximize className="w-5 h-5" />
        </button>
        <div className="w-full h-px bg-black/5" />
        <button className="text-black/20 hover:text-black transition-colors" title="Help">
          <Info className="w-5 h-5" />
        </button>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1.5s ease-out forwards; }
        .animate-fade-in-down { animation: fade-in-down 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-up { animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
