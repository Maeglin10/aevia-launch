import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated template pages and demo theme components are not app code.
    "app/templates/**",
    "components/themes/**",
    // Root-level JS build/generation scripts — not linted app code.
    "*.js",
    "scripts/**",
  ]),
  {
    rules: {
      // French text with apostrophes and quotes makes this rule impractical.
      "react/no-unescaped-entities": "off",
      // Reading localStorage in useEffect and calling setState on mount is
      // idiomatic React. The react-compiler rule flags it as an error but
      // this pattern is safe and intentional throughout the codebase.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
