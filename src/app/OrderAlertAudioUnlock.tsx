"use client";

import { useEffect } from "react";
import { unlockOrderAlertAudio } from "@/lib/order-alert-audio";

export function OrderAlertAudioUnlock() {
  useEffect(() => {
    const unlock = () => {
      void unlockOrderAlertAudio();
    };

    document.addEventListener("pointerdown", unlock, true);
    document.addEventListener("keydown", unlock, true);

    return () => {
      document.removeEventListener("pointerdown", unlock, true);
      document.removeEventListener("keydown", unlock, true);
    };
  }, []);

  return null;
}
