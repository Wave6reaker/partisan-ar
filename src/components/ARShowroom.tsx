"use client";

import React, { useEffect, useState, useRef } from "react";
import { Product } from "@/lib/data";
import { Camera, Maximize, RotateCw, Loader2 } from "lucide-react";

// Dynamically import types for @google/model-viewer if needed
// but we usage through custom element definition in types/model-viewer.d.ts

interface ARShowroomProps {
  initialProduct: Product;
  products: Product[];
}

export default function ARShowroom({ initialProduct, products }: ARShowroomProps) {
  const [activeProduct, setActiveProduct] = useState<Product>(initialProduct);
  const [isLoading, setIsLoading] = useState(true);
  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically import the model-viewer script side-effect
    import("@google/model-viewer").catch((err) =>
      console.error("Failed to load model-viewer", err)
    );
  }, []);

  const handleProductChange = (product: Product) => {
    if (product.id === activeProduct.id) return;
    setIsLoading(true);
    setActiveProduct(product);
  };

  return (
    <div className="relative w-screen h-screen bg-[#fafafa] overflow-hidden">
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
        exposure="1"
        environment-image="neutral"
        className="w-full h-full"
        onLoad={() => setIsLoading(false)}
      >
        {/* AR Button */}
        <button
          slot="ar-button"
          className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-[#171717] text-white px-8 py-4 rounded-full flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform active:scale-95 z-50 whitespace-nowrap"
        >
          <Camera className="w-5 h-5" />
          <span className="font-medium tracking-tight">Примерить в комнате</span>
        </button>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-40">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#171717]" />
              <p className="text-sm font-medium text-[#171717]/60">Загрузка модели...</p>
            </div>
          </div>
        )}

        {/* Custom Progress Bar Slot */}
        <div slot="progress-bar" className="hidden"></div>
      </model-viewer>

      {/* Model Selection Menu */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-50">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-white/20">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductChange(product)}
                className={`flex-shrink-0 px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeProduct.id === product.id
                    ? "bg-[#171717] text-white shadow-lg"
                    : "text-[#171717] hover:bg-[#171717]/5"
                }`}
              >
                {product.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Overlay */}
      <div className="absolute top-8 left-8 flex flex-col pointer-events-none">
        <h1 className="text-2xl font-bold tracking-tighter text-[#171717]">PARTISAN</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#171717]/40 font-semibold">AR Furniture Showroom</p>
      </div>

      {/* Product Info Overlay */}
      <div className="absolute top-8 right-8 text-right pointer-events-none">
        <p className="text-sm font-medium text-[#171717]/60">{activeProduct.name}</p>
        <p className="text-xl font-bold text-[#171717]">
          {activeProduct.price.toLocaleString("ru-RU")} ₽
        </p>
      </div>

      {/* Interaction Hints */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col gap-6 text-[#171717]/20 pointer-events-none hidden md:flex">
        <RotateCw className="w-6 h-6" />
        <Maximize className="w-6 h-6" />
      </div>
    </div>
  );
}
