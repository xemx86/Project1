"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { Locale } from "@/lib/i18n";

const ui = {
  en: {
    login: "Login",
    signup: "Create account",
    email: "Email",
    password: "Password",
    loggingIn: "Signing in...",
    creating: "Creating account...",
    confirmInfo:
      "Account created. If email confirmation is enabled, confirm your email and then sign in.",
    signInButton: "Sign in",
    signUpButton: "Create account",
    emailPlaceholder: "your@email.com",
  },
  es: {
    login: "Entrar",
    signup: "Crear cuenta",
    email: "Correo electrónico",
    password: "Contraseña",
    loggingIn: "Iniciando sesión...",
    creating: "Creando cuenta...",
    confirmInfo:
      "Cuenta creada. Si la confirmación por correo está activada, confirma tu email y luego inicia sesión.",
    signInButton: "Entrar",
    signUpButton: "Crear cuenta",
    emailPlaceholder: "tu@email.com",
  },
};

export function LoginForm({ lang }: { lang: Locale }) {
  const router = useRouter();
  const t = ui[lang];
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    setMessage("");

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const supabase = createBrowserSupabaseClient();

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      setLoading(false);

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setMessage(t.confirmInfo);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push(`/${lang}/admin`);
    router.refresh();
  }

  return (
    <div className="admin-form">
      <div className="inline-actions">
        <button
          type="button"
          className={mode === "login" ? "button" : "button-secondary"}
          onClick={() => setMode("login")}
        >
          {t.login}
        </button>
        <button
          type="button"
          className={mode === "signup" ? "button" : "button-secondary"}
          onClick={() => setMode("signup")}
        >
          {t.signup}
        </button>
      </div>

      <form action={onSubmit} className="admin-form">
        <div className="field">
          <label>
            {t.email}
            <input type="email" name="email" required placeholder={t.emailPlaceholder} />
          </label>
        </div>

        <div className="field">
          <label>
            {t.password}
            <input type="password" name="password" required minLength={6} />
          </label>
        </div>

        {error ? <div className="notice notice--danger">{error}</div> : null}
        {message ? <div className="notice">{message}</div> : null}

        <button className="button" disabled={loading} type="submit">
          {loading
            ? mode === "login"
              ? t.loggingIn
              : t.creating
            : mode === "login"
              ? t.signInButton
              : t.signUpButton}
        </button>
      </form>
    </div>
  );
}