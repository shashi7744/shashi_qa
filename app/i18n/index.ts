import { de } from "./de";
import { fr } from "./fr";
import { nl } from "./nl";
import type { Locale } from "./locales";
import type { LocalServices } from "./types";

export const translations: Record<Locale, LocalServices> = { de, fr, nl };
export * from "./locales";
export type { LocalService } from "./types";
