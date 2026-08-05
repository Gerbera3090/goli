import eslintConfigPrettier from "eslint-config-prettier/flat";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export const nextConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  eslintConfigPrettier,
];
