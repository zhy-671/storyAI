"use client";

import React from "react";
import dynamic from "next/dynamic";

const HTMLFlipBook: any = dynamic(() => import("react-pageflip"), { ssr: false });

export interface FlipBookPage {
  isCover?: boolean;
  image?: string | null;
  text?: string | null;
  title?: string;
  summary?: string;
}

export default function FlipBook({ pages, width = 600, height = 500, onFlip }: { pages: FlipBookPage[]; width?: number; height?: number; onFlip?: (e: any) => void; }) {
  if (!pages || pages.length === 0) return null;

  return (
    <div className="w-full flex justify-center">
      <HTMLFlipBook
        key={`flip-${width}-${height}`}
        width={width}
        height={height}
        size="stretch"
        maxShadowOpacity={0.3}
        showCover={false}
        usePortrait={false}
        mobileScrollSupport
        className="shadow-2xl rounded-lg"
        onFlip={onFlip}
      >
        {pages.map((p, idx) => (
          <div key={idx} className="w-full h-full overflow-hidden relative bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 rounded-lg">
            {/* 封面：仅显示图片并居中，不加装饰遮罩 */}
            { (p.isCover || idx === 0) ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {p.image ? (
                  <div className="relative h-full" style={{ width: "320px" }}>
                    <img src={p.image} alt={`cover`} className="absolute inset-0 w-full h-full object-cover rounded-md shadow-md" />
                  </div>
                ) : null}
                {/* 封面书脊与高光（右侧叠加），以及整体柔和高光与内边框，营造书的质感 */}
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-white/50 to-transparent pointer-events-none translate-x-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/15 pointer-events-none" />
                <div className="absolute inset-3 border-4 border-amber-700/20 rounded-lg pointer-events-none" />
              </div>
            ) : (
              <>
                {/* 内页：统一的高光/边框装饰 */}
                <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-amber-900/10 pointer-events-none" />
                <div className="absolute inset-3 border-4 border-amber-700/20 rounded-lg pointer-events-none" />

                {p.image ? (
                  <div className="relative w-full h-full">
                    <img src={p.image} alt={`page-${idx}`} className="absolute inset-0 w-full h-full object-cover rounded-md shadow" />
                    <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/15 to-transparent pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-white/60 to-transparent pointer-events-none translate-x-[2px]" />
                  </div>
                ) : (
                  <div className="relative p-6 pr-8 flex items-center justify-center h-full bg-gradient-to-br from-amber-50 to-white rounded-md shadow-inner">
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-amber-900 text-xl leading-8 text-justify indent-8 whitespace-pre-wrap break-words">{p.text}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}


