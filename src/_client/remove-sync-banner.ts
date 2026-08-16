// src/_client/remove-sync-banner.ts
if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    try {
      const CTA = "Complete synchronization deposit";
      document.querySelectorAll('button, a, [role="button"]').forEach(el => {
        if (el.textContent?.trim() === CTA) {
          const banner = el.closest('section, div, header, aside') || el.parentElement;
          if (banner) banner.remove();
        }
      });
      document.querySelectorAll('div, section, header, aside').forEach(el => {
        if (el.textContent && el.textContent.includes("Action Required: Account Synchronization Deposit")) {
          el.remove();
        }
      });
    } catch (err) {
      console.error("remove-sync-banner error", err);
    }
  });
}
