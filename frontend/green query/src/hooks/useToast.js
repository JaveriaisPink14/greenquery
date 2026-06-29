import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const push = (msg, type = "success", ms = 3000) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), ms);
  };

  const pushOnce = (key, msg, type = "success", ms = 3000) => {
    const k = `__toast_once_${key}`;
    if (typeof window !== "undefined" && window.sessionStorage) {
      if (window.sessionStorage.getItem(k)) return;
      window.sessionStorage.setItem(k, "1");
    }
    push(msg, type, ms);
  };

  const consumeSessionFlag = (key) => {
    const k = `__toast_once_${key}`;
    if (typeof window !== "undefined" && window.sessionStorage) {
      const has = window.sessionStorage.getItem(k);
      if (!has) return false;
      window.sessionStorage.removeItem(k);
      return true;
    }
    return false;
  };

  return { toasts, push, pushOnce, consumeSessionFlag };
}


