"use client";

import { useEffect, useRef } from "react";
import { refractive } from "@hashintel/refractive";
import gsap from "gsap";

export default function RefractiveCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    
    // Smooth floating animation integrating GSAP
    gsap.to(cardRef.current, {
      y: -15,
      rotationX: 2,
      rotationY: -2,
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut"
    });
  }, []);

  return (
    <div style={{ perspective: "1000px" }}>
      <refractive.div
        ref={cardRef}
        refraction={{
          radius: 20,
          blur: 15,
          bezelWidth: 8,
        }}
        style={{
          padding: "3rem 2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          maxWidth: "450px",
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          color: "white"
        }}
      >
        <div style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
            marginBottom: "1.5rem",
            boxShadow: "0 0 30px rgba(0, 242, 254, 0.6)"
        }}></div>
        <h3 style={{ fontSize: "1.8rem", marginBottom: "1rem", fontWeight: "bold" }}>
          Tarjeta Refractiva
        </h3>
        <p style={{ color: "#cccccc", textAlign: "center", lineHeight: "1.6", fontSize: "1.1rem" }}>
          Componente utilizando <strong>@hashintel/refractive</strong>. Funciona de manera excepcional combinado con las animaciones de <strong>GSAP</strong> con las que hemos preparado el entorno.
        </p>
      </refractive.div>
    </div>
  );
}
