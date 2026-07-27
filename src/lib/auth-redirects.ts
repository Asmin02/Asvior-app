import { APP_URL, getSiteUrl } from "@/lib/app-info";

function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, "");
}

function toSafeUrl(input: string): string {
  try {
    const parsed = new URL(input);
    return trimTrailingSlashes(`${parsed.protocol}//${parsed.host}`);
  } catch {
    return APP_URL;
  }
}

export function getAuthSiteUrl(): string {
  return toSafeUrl(getSiteUrl());
}

export function getEmailVerificationRedirectUrl(): string {
  return getAuthSiteUrl();
}

export function getPasswordResetRedirectUrl(): string {
  return `${getAuthSiteUrl()}/reset-password`;
}

export function getMagicLinkRedirectUrl(): string {
  return getAuthSiteUrl();
}

export function getOAuthRedirectUrl(): string {
  return `${getAuthSiteUrl()}/auth`;
}
