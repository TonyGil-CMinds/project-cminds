"use client";

import { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import SubscribeModal, { type CloseResult } from "./SubscribeModal";

interface SubscribeModalContextValue {
  open: (onSuccess?: () => void) => void;
}

const SubscribeModalContext = createContext<SubscribeModalContextValue>({ open: () => {} });

export function useSubscribeModal() {
  return useContext(SubscribeModalContext);
}

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, y: -14 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
    );
    const timer = setTimeout(() => {
      gsap.to(ref.current, {
        opacity: 0, y: -10, duration: 0.28, ease: "power2.in",
        onComplete: onDone,
      });
    }, 3800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div ref={ref} className="sub-toast">
      <span className="sub-toast-icon">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      {message}
    </div>
  );
}

export default function SubscribeModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen]   = useState(false);
  const [toast, setToast]     = useState<string | null>(null);
  const onSuccessRef           = useRef<(() => void) | undefined>(undefined);

  const open = useCallback((onSuccess?: () => void) => {
    onSuccessRef.current = onSuccess;
    setIsOpen(true);
  }, []);

  const handleClose = useCallback((result: CloseResult) => {
    setIsOpen(false);
    if (result === "success") {
      onSuccessRef.current?.();
      onSuccessRef.current = undefined;
    } else if (result === "already_subscribed") {
      document.cookie = "cminds_subscribed=1; path=/; max-age=31536000; SameSite=Lax";
      onSuccessRef.current?.();
      onSuccessRef.current = undefined;
      setToast("You're already subscribed!");
    }
  }, []);

  return (
    <SubscribeModalContext.Provider value={{ open }}>
      {children}
      {isOpen && <SubscribeModal onClose={handleClose} />}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </SubscribeModalContext.Provider>
  );
}
