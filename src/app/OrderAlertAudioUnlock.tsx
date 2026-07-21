"use client";

import { useEffect } from "react";
import { unlockOrderAlertAudio } from "@/lib/order-alert-audio";

export function OrderAlertAudioUnlock() {
  useEffect(() => {
    const unlock = () => {
      console.log("[AudioUnlock] User gesture detected, unlocking...");
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
