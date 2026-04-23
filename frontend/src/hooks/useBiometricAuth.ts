import { useState, useRef, useCallback } from "react";
import { apiFetch } from "@/lib/api";

type PendingAction = "number" | "cvv" | null;

interface BiometricAuthReturn {
  securityUnlocked: boolean;
  showPasswordModal: boolean;
  showCreatePinModal: boolean;
  setShowCreatePinModal: (v: boolean) => void;
  passwordError: string;
  isVerifying: boolean;
  requestAccess: (action: PendingAction, onSuccess: (action: PendingAction) => void) => Promise<void>;
  submitPassword: (password: string) => Promise<void>;
  cancelModal: () => void;
  lockDetails: () => void;
  setOnLock: (fn: () => void) => void;
}

async function isBiometricAvailable(): Promise<boolean> {
  try {
    if (typeof window === "undefined") return false;
    if (!window.PublicKeyCredential) return false;
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch { return false; }
}

async function triggerBiometric(): Promise<boolean> {
  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: "required",
        rpId: window.location.hostname,
      },
    });
    return credential !== null;
  } catch { return false; }
}

export function useBiometricAuth(): BiometricAuthReturn {
  const [securityUnlocked, setSecurityUnlocked] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showCreatePinModal, setShowCreatePinModal] = useState(false);

  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingActionRef = useRef<PendingAction>(null);
  const onSuccessRef = useRef<((action: PendingAction) => void) | null>(null);
  const onLockRef = useRef<(() => void) | null>(null);

  function startLockTimer() {
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      setSecurityUnlocked(false);
      // Fire the onLock callback so the card page hides details
      if (onLockRef.current) onLockRef.current();
    }, 60000);
  }

  const setOnLock = useCallback((fn: () => void) => {
    onLockRef.current = fn;
  }, []);

  const requestAccess = useCallback(async (
    action: PendingAction,
    onSuccess: (action: PendingAction) => void
  ) => {
    if (securityUnlocked) {
      onSuccess(action);
      startLockTimer();
      return;
    }

    pendingActionRef.current = action;
    onSuccessRef.current = onSuccess;

    const biometricAvailable = await isBiometricAvailable();
    if (biometricAvailable) {
      const passed = await triggerBiometric();
      if (passed) {
        setSecurityUnlocked(true);
        startLockTimer();
        onSuccess(action);
        return;
      }
      return;
    }

    setPasswordError("");
    setShowPasswordModal(true);
  }, [securityUnlocked]);

  const submitPassword = useCallback(async (password: string) => {
    if (!password) return;
    setIsVerifying(true);
    setPasswordError("");
    try {
      const res = await apiFetch("/api/cards/verify-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        setShowPasswordModal(false);
        setSecurityUnlocked(true);
        startLockTimer();
        if (onSuccessRef.current) onSuccessRef.current(pendingActionRef.current);
      } else if (data.pin_not_set) {
        setShowPasswordModal(false);
        setShowCreatePinModal(true);
      } else {
        setPasswordError(data.error || "Incorrect card PIN. Please try again.");
      }
    } catch {
      setPasswordError("Could not verify. Check your connection.");
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const cancelModal = useCallback(() => {
    setShowPasswordModal(false);
    setPasswordError("");
    pendingActionRef.current = null;
    onSuccessRef.current = null;
  }, []);

  const lockDetails = useCallback(() => {
    if (lockTimer.current) clearTimeout(lockTimer.current);
    setSecurityUnlocked(false);
    if (onLockRef.current) onLockRef.current();
  }, []);

  return {
    securityUnlocked,
    showPasswordModal,
    showCreatePinModal,
    setShowCreatePinModal,
    passwordError,
    isVerifying,
    requestAccess,
    submitPassword,
    cancelModal,
    lockDetails,
    setOnLock,
  };
}
