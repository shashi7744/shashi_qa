import type { Block } from "../posts";

/** A guide translated into one language. `key` is the English slug it translates. */
export type LocalPost = {
  key: string;
  slug: string; // URL slug in the local language
  title: string;
  description: string;
  body: Block[];
};
