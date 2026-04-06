import type { NextConfig } from "next";

/**
 * Rewrites require destination `http(s)://...` or a path starting with `/`.
 * Railway private hostnames like `*.railway.internal` only work inside Railway's network;
 * on Vercel use the service's public URL (e.g. https://xxx.up.railway.app).
 */
function normalizeBackendBase(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/** Build-time (Vercel: set API_URL or NEXT_PUBLIC_API_URL to full public backend URL). */
const backendBase = normalizeBackendBase(
  process.env.API_URL ||
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:3001",
);

const hasBackendEnv = !!(
  process.env.API_URL ||
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL
);
if (process.env.VERCEL === "1" && !hasBackendEnv) {
  console.warn(
    "\n⚠️  Icoltex: sin API_URL / BACKEND_URL / NEXT_PUBLIC_API_URL en Vercel. " +
      "Las rutas /api/* no proxyean a tu backend → 404 en producción.\n" +
      "   Añade en Vercel → Settings → Environment Variables:\n" +
      "   NEXT_PUBLIC_API_URL=https://tu-backend-publico.com\n" +
      "   (sin barra final). Incluye el mismo origen en CORS_ORIGINS del backend.\n",
  );
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendBase}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/uc/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
