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
                    className="relative flex flex-col h-full bg-gradient-to-br from-amber-50 to-white rounded-md shadow-inner w-full"
                    style={{
                      paddingTop: Math.max(20, Math.floor((height || 500) * 0.04)), // 进一步减少顶部边距
                      paddingRight: 32,
                      paddingLeft: 32,
                      paddingBottom: Math.max(20, Math.floor((height || 500) * 0.04)), // 减少底部边距
                    }}
                  >
                    {(() => {
                      const raw = String(p.text || '');
                      const plainLen = raw.replace(/\s+/g, '').length;
                      // 检测是否为英文内容（简单判断：非中文字符占比 > 70%）
                      const isEnglish = (raw.match(/[a-zA-Z]/g)?.length || 0) / Math.max(plainLen, 1) > 0.7;
                      
                      // 根据内容长度和页面高度动态调整字号，让内容更好地填充页面
                      let sizeCls = "text-base leading-[1.8]";
                      const pageHeight = height || 500;
                      const availableHeight = pageHeight - (Math.max(24, Math.floor(pageHeight * 0.05)) * 2);
                      const estimatedLines = Math.ceil(plainLen / (isEnglish ? 50 : 30));
                      const lineHeight = isEnglish ? 1.8 : 1.7;
                      const totalTextHeight = estimatedLines * (sizeCls.includes('text-lg') ? 28 : sizeCls.includes('text-base') ? 24 : sizeCls.includes('text-sm') ? 20 : 16) * lineHeight;
                      
                      // 如果内容较少，增大字号以填充页面
                      if (totalTextHeight < availableHeight * 0.4) {
                        if (plainLen <= 100) sizeCls = "text-xl leading-[2.2]";
                        else if (plainLen <= 200) sizeCls = "text-lg leading-[2.0]";
                        else sizeCls = "text-base leading-[1.8]";
                      } else if (plainLen <= 160) {
                        sizeCls = "text-base leading-[1.8]";
                      } else if (plainLen <= 280) {
                        sizeCls = "text-sm leading-[1.7]";
                      } else {
                        sizeCls = "text-xs leading-[1.6]";
                      }
                      
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


