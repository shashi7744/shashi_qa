import type { ServiceKey } from "../data";

/** A service translated into one language. Plans are in the same order as the English plans in data.ts. */
export type LocalService = {
  label: string;
  title: string;
  short: string;
  lead: string;
  includes: string[];
  time: string;
  local: string;
  plans: { name: string; per: string; for: string; features: string[] }[];
  seoTitle: string;
  seoDescription: string;
  audience: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
};

export type LocalServices = Record<ServiceKey, LocalService>;
