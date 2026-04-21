import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";

export interface VirtualCard {
  id: string;
  card_type: string;
  card_number: string;
  cardholder_name: string;
  expiry_month: string;
  expiry_year: string;
  cvv: string;
  balance: number;
  purchase_amount: number;
  status: "pending" | "approved" | "active" | "suspended" | "expired" | "rejected";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UseVirtualCardReturn {
  card: VirtualCard | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useVirtualCard(): UseVirtualCardReturn {
  const [card, setCard] = useState<VirtualCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/api/virtualcards/");
      if (res.status === 401 || res.status === 403) {
        throw new Error("Session expired. Please log in again.");
      }
      if (!res.ok) throw new Error(`Failed to load card (${res.status})`);
      const data = await res.json();
      const list: VirtualCard[] = Array.isArray(data) ? data : [];
      const active = list.find((c) => c.is_active) || list[0] || null;
      setCard(active);
    } catch (e: any) {
      setError(e?.message || "Failed to load virtual card");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCard();
  }, [fetchCard]);

  return { card, loading, error, refetch: fetchCard };
}
