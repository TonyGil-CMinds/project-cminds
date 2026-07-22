"use client";

import {
  AnimatePresence,
  motion,
  useDragControls,
  useMotionValue,
  useScroll,
  useTransform,
  type PanInfo,
} from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useMeasure from "react-use-measure";

const TICK_COUNT = 40;

export type ScrollBarProps = {
  label: string;
  show: boolean;
};

export function ScrollBar({ label, show }: ScrollBarProps) {
  const [barRef, barBounds] = useMeasure();
  const { scrollYProgress } = useScroll();

  const dragControls = useDragControls();
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [ghostPosition, setGhostPosition] = useState<number | null>(null);

  const handleX = useMotionValue(0);

  const scrollTransformX = useTransform(
    scrollYProgress,
    [0, 1],
    [0, Math.max(barBounds.width - 24, 0)]
  );

  useEffect(() => {
    if (isDragging) return;
    const unsub = scrollTransformX.on("change", (v) => {
      handleX.set(v);
    });
    return () => unsub();
  }, [scrollTransformX, handleX, isDragging]);

  useEffect(() => {
    if (!isDragging) {
      handleX.set(scrollTransformX.get());
    }
  }, [barBounds.width, handleX, isDragging, scrollTransformX]);

  const scrollToRatio = (ratio: number) => {
    const clamped = Math.max(0, Math.min(1, ratio));
    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - window.innerHeight;
    window.scrollTo({ top: clamped * maxScroll, behavior: "auto" });
  };

  const handleScrollBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    scrollToRatio(ratio);
  };

  const handleDrag = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (!barBounds.width) return;
    const rect = { left: barBounds.left, width: barBounds.width };
    const ratio = (info.point.x - rect.left) / rect.width;
    scrollToRatio(ratio);
  };

  const handleBarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setGhostPosition(e.clientX - rect.left);
  };

  const handleBarMouseLeave = () => {
    setGhostPosition(null);
  };

  const scrollbarBars = useMemo(
    () => Array.from({ length: TICK_COUNT }, (_, i) => i),
    []
  );

  return (
    <div className={`sk-scrollbar${show ? " sk-scrollbar-visible" : ""}`}>
      <AnimatePresence>
        {show && (
          <motion.div
            className="sk-card"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            key={label}
          >
            <span className="sk-card-label">{label}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="sk-bar"
        ref={barRef}
        onClick={handleScrollBarClick}
        onMouseMove={handleBarMouseMove}
        onMouseLeave={handleBarMouseLeave}
      >
        {ghostPosition !== null && (
          <div className="sk-ghost" style={{ left: ghostPosition }} />
        )}

        {scrollbarBars.map((i) => (
          <div
            key={i}
            className="sk-tick"
            style={{
              opacity: 0.2 + (i / TICK_COUNT) * 0.1,
              filter: `blur(${Math.max(0, 2 - i * 0.1)}px)`,
            }}
          />
        ))}

        <motion.div
          className="sk-handle"
          drag="x"
          dragControls={dragControls}
          dragConstraints={{ left: 0, right: Math.max(barBounds.width - 24, 0) }}
          dragElastic={0}
          dragMomentum={false}
          style={{ x: handleX }}
          onDragStart={() => {
            isDraggingRef.current = true;
            setIsDragging(true);
          }}
          onDrag={handleDrag}
          onDragEnd={() => {
            isDraggingRef.current = false;
            setIsDragging(false);
          }}
        />
      </div>
    </div>
  );
}
