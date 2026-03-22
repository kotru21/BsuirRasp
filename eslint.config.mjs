import { defineConfig, globalIgnores } from "eslint/config";
import boundaries from "eslint-plugin-boundaries";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

/** FSD-порядок слоёв: shared → entities → features → widgets → views; root и app — сверху. */
const fsdBoundaries = {
  plugins: { boundaries },
  files: ["src/**/*.{ts,tsx}", "app/**/*.{ts,tsx}"],
  settings: {
    "boundaries/elements": [
      { type: "app", pattern: "app/**/*" },
      { type: "shared", pattern: "src/shared/**/*" },
      { type: "entities", pattern: "src/entities/**/*" },
      { type: "features", pattern: "src/features/**/*" },
      { type: "widgets", pattern: "src/widgets/**/*" },
      { type: "views", pattern: "src/views/**/*" },
      { type: "root", pattern: "src/root/**/*" },
    ],
  },
  rules: {
    "boundaries/dependencies": [
      "error",
      {
        default: "disallow",
        rules: [
          {
            from: { type: "app" },
            allow: {
              to: {
                type: [
                  "app",
                  "shared",
                  "entities",
                  "features",
                  "widgets",
                  "views",
                  "root",
                ],
              },
            },
          },
          {
            from: { type: "views" },
            allow: {
              to: { type: ["shared", "entities", "features", "widgets", "views"] },
            },
          },
          {
            from: { type: "widgets" },
            allow: {
              to: { type: ["shared", "entities", "features", "widgets"] },
            },
          },
          {
            from: { type: "features" },
            allow: {
              to: { type: ["shared", "entities", "features"] },
            },
          },
          {
            from: { type: "entities" },
            allow: { to: { type: ["shared", "entities"] } },
          },
          {
            from: { type: "shared" },
            allow: { to: { type: ["shared"] } },
          },
          {
            from: { type: "root" },
            allow: { to: { type: ["shared", "root"] } },
          },
        ],
      },
    ],
    "boundaries/entry-point": "off",
    "boundaries/external": "off",
    "boundaries/no-unknown": "off",
    "boundaries/no-unknown-files": "off",
    "boundaries/no-ignored": "off",
    "boundaries/no-private": "off",
    "boundaries/element-types": "off",
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  fsdBoundaries,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
