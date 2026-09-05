"use client";

import { useState } from "react";

export default function ResendVerificationButton() {
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">("idle");

  async function handleClick() {
    setState("loading");
    const res = await fetch("/api/verify-email/resend", { method: "POST" });
    setState(res.ok ? "sent" : "error");
  }

  if (state === "sent") {
    return <span className="text-sm font-medium">Email envoyé, pensez à vérifier vos spams.</span>;
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      className="text-sm underline font-medium disabled:opacity-50"
    >
      {state === "loading" ? "Envoi..." : state === "error" ? "Erreur, réessayer" : "Renvoyer l'email"}
    </button>
  );
}
