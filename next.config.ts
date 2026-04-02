import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Явно тянем PEM в serverless-трейс, если снова читаем с диска */
  outputFileTracingIncludes: {
    "/*": ["./certs/**/*"],
  },
};

export default nextConfig;
