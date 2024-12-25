"use client";
import React, { useEffect, useState } from "react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

export default function Confetti() {
  const [confettiOpen, setConfettiOpen] = useState(false);

  useEffect(() => {
    setConfettiOpen(true);

    setTimeout(() => {
      setConfettiOpen(false);
    }, 4000);
  }, []);

  return <>{confettiOpen && <Fireworks autorun={{ speed: 3 }} />}</>;
}
