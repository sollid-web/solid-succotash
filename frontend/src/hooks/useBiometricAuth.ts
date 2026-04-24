import { useState, useCallback, useRef } from "react";

type AuthMethod = "biometric" | "password" | "none";

interface BiometricAuthResult {
  success: boolean;
  method: AuthMethod;
  error?: string;
}

function isWebAuthnSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.PublicKeyCredential &&
    !!navigator.credentials
  );
}

async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  try {
    if (!isWebAuthnSupported()) return false;
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

function generateChallenge(): Uint8Array {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  return challenge;
}

export function useBiometricAuth() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showPasswordFallback, setShowPasswordFallback] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [securityUnlocked, setSecurityUnlocked] = useState(false);
  const resolveRef = useRef<((result: BiometricAuthResult) => void) | null>(null);

  const authenticate = useCallback(async (): Promise<BiometricAuthResult> => {
    return new Promise(async (resolve) => {
      resolveRef.current = resolve;
      setIsAuthenticating(true);

      try {
        const platformAvailable = await isPlatformAuthenticatorAvailable();

        if (platformAvailable) {
          const credential = await navigator.credentials.get({
            publicKey: {
              challenge: generateChallenge(),
              timeout: 60000,
              userVerification: "required",
              rpId: window.location.hostname,
            },
          });

          if (credential) {
            setIsAuthenticating(false);
            setSecurityUnlocked(true);
            resolve({ success: true, method: "biometric" });
            return;
          }
        }

        setShowPasswordFallback(true);
      } catch (err: any) {
        if (err?.name === "NotAllowedError" || err?.name === "AbortError") {
          setIsAuthenticating(false);
          resolve({ success: false, method: "biometric", error: "Authentication cancelled" });
          return;
        }
        setShowPasswordFallback(true);
      }
    });
  }, []);

  async function submitPassword(correctPassword?: string) {
    setPasswordError("");
    try {
      const { apiFetch } = await import("@/lib/api");
      const res = await apiFetch("/api/auth/verify-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setShowPasswordFallback(false);
        setPassword("");
        setIsAuthenticating(false);
        setSecurityUnlocked(true);
        resolveRef.current?.({ success: true, method: "password" });
      } else {
        setPasswordError("Incorrect password. Please try again.");
      }
    } catch {
      setPasswordError("Could not verify password. Try again.");
    }
  }

  function cancelAuth() {
    setShowPasswordFallback(false);
    setPassword("");
    setPasswordError("");
    setIsAuthenticating(false);
    setSecurityUnlocked(false);
    resolveRef.current?.({ success: false, method: "none", error: "Cancelled" });
  }

  return {
    authenticate,
    isAuthenticating,
    showPasswordFallback,
    password,
    setPassword,
    passwordError,
    submitPassword,
    cancelAuth,
    securityUnlocked,
  };
}
