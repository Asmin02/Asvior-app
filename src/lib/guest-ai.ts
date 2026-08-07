/** Guest AI trial — limited free prompts before sign-in is required. */
export const GUEST_AI_MESSAGE_LIMIT = 5;

const GUEST_AI_COUNT_KEY = "vp_guest_ai_messages_v1";

export function getGuestAiMessageCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(GUEST_AI_COUNT_KEY);
    const n = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function getGuestAiRemaining(): number {
  return Math.max(0, GUEST_AI_MESSAGE_LIMIT - getGuestAiMessageCount());
}

export function incrementGuestAiMessageCount(): number {
  const next = getGuestAiMessageCount() + 1;
  try {
    localStorage.setItem(GUEST_AI_COUNT_KEY, String(next));
  } catch {
    /* ignore quota errors */
  }
  return next;
}

export function isGuestAiLimitReached(): boolean {
  return getGuestAiMessageCount() >= GUEST_AI_MESSAGE_LIMIT;
}
