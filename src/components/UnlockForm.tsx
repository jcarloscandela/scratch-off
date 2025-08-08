"use client";

import { useState } from "react";

interface UnlockFormProps {
  onUnlock: () => void;
}

export default function UnlockForm({ onUnlock }: UnlockFormProps) {
  const [password, setPassword] = useState("");

  const handleUnlock = () => {
    if (password === "1995") {
      onUnlock();
    } else {
      alert("Contraseña incorrecta");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px", border: "1px solid", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
      <h2 style={{ marginBottom: "20px", color: "black" }}>Introduce la contraseña para desbloquear:</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "10px", width: "100%", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc", color: "black" }}
      />
      <button
        onClick={handleUnlock}
        style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
      >
        Desbloquear
      </button>
    </div>
  );
}
