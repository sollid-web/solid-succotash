import { useState, useCallback, useRef } from "react";

type AuthMethod = "biometric" | "password" | "none";
type RevealAction = "number" | "cvv" | string;

interface BiometricAuthResult {
  success: boolean;
  method: AuthMethod;
  error?: string;
}

export function useBiometricAuth() {
  const [securityUnlocked, setSecurityUnlocked] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCreatePinModal, setShowCreatePinModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const onSuccessRef = useRef<((action: RevealAction) => void) | null>(null);
  const pendingActionRef = useRef<RevealAction>("number");
  const onLockRef = useRef<(() => void) | null>(null);

  function setOnLock(cb: () => void) {
    onLockRef.current = cb;
  }

  const requestAccess = useCallback(
    (action: RevealAction, onSuccess: (action: RevealAction) => void) => {
      if (securityUnlocked) {
        onSuccess(action);
        return;
      }
      pendingActionRef.current = action;
      onSuccessRef.current = onSuccess;
      checkPinExists();
    },
    [securityUnlocked]
  );

  async function checkPinExists() {
    setIsAuthenticating(true);
    try {
      const { apiFetch } = await import("@/lib/api");
      const res = await apiFetch("/api/cards/check-pin/");
      const data = await res.json();
      if (data.has_pin) {
        setShowPasswordModal(true);
      } else {
        setShowCreatePinModal(true);
      }
    } catch {
      setShowPasswordModal(true);
    } finally {
      setIsAuthenticating(false);
    }
  }

  async function submitPassword(pin: string) {
    setIsVerifying(true);
    setPasswordError("");
    try {
      const { apiFetch } = await import("@/lib/api");
      const res = await apiFetch("/api/cards/verify-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pin }),
      });
      if (res.ok) {
        setShowPasswordModal(false);
        setPassword("");
        setSecurityUnlocked(true);
        onSuccessRef.current?.(pendingActionRef.current);
      } else {
        setPasswordError("Incorrect PIN. Please try again.");
      }
    } catch {
      setPasswordError("Could not verify PIN. Try again.");
    } finally {
      setIsVerifying(false);
    }
  }

  function cancelModal() {
    setShowPasswordModal(false);
    setShowCreatePinModal(false);
    setPassword("");
    setPasswordError("");
    setIsAuthenticating(false);
  }

  function lockDetails() {
    setSecurityUnlocked(false);
    onLockRef.current?.();
  }

  const authenticate = useCallback(async (): Promise<BiometricAuthResult> => {
    return new Promise((resolve) => {
      requestAccess("number", () => {
        resolve({ success: true, method: "password" });
      });
    });
  }, [requestAccess]);

  return {
    securityUnlocked,
    isAuthenticating,
    isVerifying,
    showPasswordModal,
    showCreatePinModal,
    password,
    passwordError,
    authenticate,
    requestAccess,
    submitPassword,
    cancelModal,
    lockDetails,
    setOnLock,
    setShowCreatePinModal,
    setPassword,
  };
}
