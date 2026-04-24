/**
 * useBiometricAuth
 * Uses WebAuthn / Web Authentication API to trigger native device biometric.
 * Falls back to a password prompt if biometrics not available.
 * Works on: Android fingerprint, iOS Face ID, Windows Hello, device PIN.
 */

import { useState, useCallback, useRef } from "react";

type AuthMethod = "biometric" | "password" | "none";

interface BiometricAuthResult {
  success: boolean;
  method: AuthMethod;
  error?: string;
}

// Check if WebAuthn is supported
function isWebAuthnSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.PublicKeyCredential &&
    !!navigator.credentials
  );
}

// Check if platform authenticator (fingerprint/Face ID) is available
async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  try {
    if (!isWebAuthnSupported()) return false;
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

// Generate a random challenge
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
  const resolveRef = useRef<((result: BiometricAuthResult) => void) | null>(null);

  const authenticate = useCallback(async (): Promise<BiometricAuthResult> => {
    return new Promise(async (resolve) => {
      resolveRef.current = resolve;
      setIsAuthenticating(true);

      try {
        const platformAvailable = await isPlatformAuthenticatorAvailable();

        if (platformAvailable) {
          // Trigger native biometric prompt
          const credential = await navigator.credentials.get({
            publicKey: {
              challenge: generateChallenge(),
              timeout: 60000,
              userVerification: "required", // forces biometric/PIN
              rpId: window.location.hostname,
            },
          });

          if (credential) {
            setIsAuthenticating(false);
            resolve({ success: true, method: "biometric" });
            return;
          }
        }

        // Biometric not available — show password fallback
        setShowPasswordFallback(true);
      } catch (err: any) {
        // User cancelled biometric
        if (
          err?.name === "NotAllowedError" ||
          err?.name === "AbortError"
        ) {
          setIsAuthenticating(false);
          resolve({ success: false, method: "biometric", error: "Authentication cancelled" });
          return;
        }
        // Any other error — fall back to password
        setShowPasswordFallback(true);
      }
    });
  }, []);

  async function submitPassword(correctPassword?: string) {
    // In production: verify password against your API
    // Here we call /api/auth/verify-password/ 
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
  };
}
