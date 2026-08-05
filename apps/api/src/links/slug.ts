import { randomInt } from "node:crypto";

const alphabet = "23456789abcdefghjkmnpqrstuvwxyz";

export function generateSlug(length = 7): string {
  return Array.from(
    { length },
    () => alphabet[randomInt(0, alphabet.length)],
  ).join("");
}
