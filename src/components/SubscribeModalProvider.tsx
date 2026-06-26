"use client";

import { createContext, useContext, useState, useRef, useCallback } from "react";
import SubscribeModal from "./SubscribeModal";

interface SubscribeModalContextValue {
  open: (onSuccess?: () => void) => void;
}

const SubscribeModalContext = createContext<SubscribeModalContextValue>({ open: () => {} });

export function useSubscribeModal() {
  return useContext(SubscribeModalContext);
}

export default function SubscribeModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen]   = useState(false);
  const onSuccessRef           = useRef<(() => void) | undefined>(undefined);

  const open = useCallback((onSuccess?: () => void) => {
    onSuccessRef.current = onSuccess;
    setIsOpen(true);
  }, []);

  const handleClose = useCallback((success = false) => {
    setIsOpen(false);
    if (success && onSuccessRef.current) {
      onSuccessRef.current();
      onSuccessRef.current = undefined;
    }
  }, []);

  return (
    <SubscribeModalContext.Provider value={{ open }}>
      {children}
      {isOpen && <SubscribeModal onClose={handleClose} />}
    </SubscribeModalContext.Provider>
  );
}
