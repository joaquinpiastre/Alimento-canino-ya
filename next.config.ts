import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placedog.net" },
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "*.ufs.sh" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "elrusotiendademascotas.com.ar" },
      { protocol: "https", hostname: "mercadoanimal.ar" },
      { protocol: "https", hostname: "www.sabrositos.com.ar" },
      { protocol: "https", hostname: "jumboargentina.vtexassets.com" },
      { protocol: "https", hostname: "acdn-us.mitiendanube.com" },
      { protocol: "https", hostname: "delypet.com.ar" },
      { protocol: "https", hostname: "herspet.com" },
      { protocol: "https", hostname: "agro-veterinaria.com.ar" },
      { protocol: "https", hostname: "petshopfelices.com.ar" },
      { protocol: "https", hostname: "pellegrinipetshop.com.ar" },
      { protocol: "https", hostname: "grupodelsur.com.ar" },
    ],
  },
};

export default nextConfig;
