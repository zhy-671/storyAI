"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import FlipBook from "./FlipBook";

type Page = {
  image?: string;
  text?: string;
  title?: string;
};

export default function AiStoryBook({
  pages,
  width = 300, // 单页宽度
  height = 480,
}: {
  pages: Page[];
  width?: number;
  height?: number;
}) {
  const bookRef = useRef<any>(null);
  const [currentBookPage, setCurrentBookPage] = useState(0); // HTMLFlipBook 内部的页码 (0, 1, 2...)

  // 计算外部容器的实际宽度，模拟书本打开/合上的效果
  // 将业务 pages 转为 FlipBook 需要的数据（封面 + 每个场景一页合成：左图右文 + 封底）
  const flipPages = useMemo(() => {
    const arr: { image?: string | null; text?: string | null; title?: string; isCover?: boolean }[] = [];
    if (!pages || pages.length === 0) return arr;
    // 封面（单页）
    const cover = pages[0];
    // 封面左页：封面图
    arr.push({ image: cover.image || null, text: null, title: cover.title, isCover: true });
    // 封面右页：封面文字（标题/摘要）
    arr.push({ image: null, text: cover.text || "", title: cover.title });
    // 确保封面后紧跟内容页（左=图片，右=文字），避免只显示单页的情况
    // 场景页：每个场景拆为两页（左页图片，右页文字）
    for (let i = 1; i < pages.length; i++) {
      const p = pages[i];
      // 左页：图片
      arr.push({ image: p.image || null, text: null, title: p.title });
      // 右页：文字
      arr.push({ image: null, text: p.text || "", title: p.title });
    }
    // Back cover (single page)
    arr.push({ image: null, text: "The End" });
    return arr;
  }, [pages]);

  // 外部容器宽度：封面/封底单页，其余双页
  const containerWidth = useMemo(() => {
    return width * 2;
  }, [width]);

  // 构建 HTMLFlipBook 实际要渲染的页面数组
  if (!pages?.length) return null;
  if (!flipPages.length) return null;


  // 确保 HTMLFlipBook 渲染前 pages 数组已准备好
  if (!pages?.length) return null;
  if (!flipPages.length) return null;


  // 使用 FlipBook 直接渲染数据
  return (
    <div
      className="mx-auto px-4 transition-all duration-700 ease-in-out relative w-full"
      style={{ 
        width: '100%',
        maxWidth: `${containerWidth}px`,
        height: `${height}px`,
        filter: 'drop-shadow(0 20px 25px rgba(139, 69, 19, 0.15))'
      }}
    >
      <FlipBook
        pages={flipPages}
        width={width} // 单页画布宽度保持 320，外层容器控制展开为 640
        height={height}
        onFlip={(e:any)=> setCurrentBookPage(e.data)}
      />
      {/* 中央书脊凹槽阴影，增强书本质感 */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-full w-6 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
    </div>
  );
}