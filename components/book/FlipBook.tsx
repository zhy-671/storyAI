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
                  <div className="relative h-full w-full">
                    <img src={p.image} alt={`cover`} className="absolute inset-0 w-full h-full object-cover rounded-md shadow-md" />
                  </div>
                ) : null}
                {/* 封面书脊与高光（右侧叠加），以及整体柔和高光与内边框，营造书的质感 */}
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-white/50 to-transparent pointer-events-none translate-x-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/15 pointer-events-none" />
              </div>
            ) : (
              <>
                {/* 内页：统一的高光/边框装饰 - 调整位置避免与内容重叠 */}
                <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 via-transparent to-amber-900/10 pointer-events-none" />
                
                {p.image ? (
                  <div className="relative w-full h-full">
                    <img src={p.image} alt={`page-${idx}`} className="absolute inset-0 w-full h-full object-cover rounded-md shadow" />
                    <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/15 to-transparent pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-white/60 to-transparent pointer-events-none translate-x-[2px]" />
                  </div>
                ) : (
                  <div 
                    className="relative flex items-start justify-start h-full bg-gradient-to-br from-amber-50 to-white rounded-md shadow-inner w-full"
                    style={{
                      paddingTop: Math.max(32, Math.floor((height || 500) * 0.08)), // 增加顶部边距
                      paddingRight: 32,
                      paddingLeft: 32,
                      paddingBottom: Math.max(24, Math.floor((height || 500) * 0.06)),
                    }}
                  >
                    {(() => {
                      const raw = String(p.text || '');
                      const plainLen = raw.replace(/\s+/g, '').length;
                      // 检测是否为英文内容（简单判断：非中文字符占比 > 70%）
                      const isEnglish = (raw.match(/[a-zA-Z]/g)?.length || 0) / Math.max(plainLen, 1) > 0.7;
                      
                      // 动态字号与行高：内容少 → 字号大；内容多 → 字号小
                      let sizeCls = "text-base leading-[1.8]";
                      if (plainLen <= 80) sizeCls = "text-lg leading-[2.0]";
                      else if (plainLen <= 160) sizeCls = "text-base leading-[1.8]";
                      else if (plainLen <= 280) sizeCls = "text-sm leading-[1.7]";
                      else sizeCls = "text-xs leading-[1.6]";
                      
                      // 英文书籍排版：serif 字体、左对齐、段落间距（无首行缩进）、适当的字间距
                      const textStyle = isEnglish 
                        ? `${sizeCls} font-serif text-left tracking-wide`
                        : `${sizeCls} text-justify`;
                      
                      return (
                        <div className={`w-full text-amber-900 ${textStyle} whitespace-pre-line break-words`}> 
                          {raw
                            .split(/\n{1,}/)
                            .filter(Boolean)
                            .map((para, i) => (
                              <p key={i} className={`${isEnglish ? 'mb-4 last:mb-0' : 'mb-3 last:mb-0'} hyphens-auto`}>
                                {para}
                              </p>
                            ))}
                        </div>
                      );
                    })()}
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


