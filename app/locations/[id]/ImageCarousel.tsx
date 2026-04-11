"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageCarousel({ images, name }: { images: string[], name: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[400px] bg-surface-container-high rounded-3xl flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-surface-container-lowest m-2 rounded-2xl -z-10"></div>
        <div className="text-outline-variant/50 flex flex-col items-center">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No images documented</p>
        </div>
      </div>
    );
  }

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden group">
      {/* Blurred edges for material depth constraint */}
      <div className="absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_40px_rgba(255,248,240,0.8)] dark:shadow-[inset_0_0_40px_rgba(20,18,15,0.8)]"></div>
      
      <Image
        src={images[currentIndex]}
        alt={`${name} - Image ${currentIndex + 1}`}
        fill
        className="object-cover transition-opacity duration-500"
        unoptimized={images[currentIndex].startsWith('http')}
      />

      {images.length > 1 && (
        <>
          <button 
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-surface/50 backdrop-blur-md text-on-surface p-3 rounded-full hover:bg-surface-container-high transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-surface/50 backdrop-blur-md text-on-surface p-3 rounded-full hover:bg-surface-container-high transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`w-2.5 h-2.5 rounded-full transition-colors ${i === currentIndex ? 'bg-primary' : 'bg-surface/50 backdrop-blur-md'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
