const PENDING_KEY = "vp_pending_ai_prompt";

/** Store a prompt so /assistant can auto-send even if search params are dropped. */
export function stashPendingAiPrompt(prompt: string): void {
  if (typeof sessionStorage === "undefined") return;
  const value = prompt.trim();
  if (!value) return;
  try {
    sessionStorage.setItem(PENDING_KEY, value);
  } catch {
    // ignore
  }
}

/** Read without removing — use until the prompt is actually submitted. */
export function peekPendingAiPrompt(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const value = sessionStorage.getItem(PENDING_KEY);
    return value?.trim() || null;
  } catch {
    return null;
  }
}

export function consumePendingAiPrompt(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const value = sessionStorage.getItem(PENDING_KEY);
    if (!value) return null;
    sessionStorage.removeItem(PENDING_KEY);
    return value.trim() || null;
  } catch {
    return null;
  }
}

export function clearPendingAiPrompt(): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    // ignore
  }
}
