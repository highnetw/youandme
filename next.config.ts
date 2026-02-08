import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 외부 사진(Supabase 등)을 허용하는 보안 설정입니다.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 모든 사이트의 이미지를 허락합니다.
      },
    ],
  },
};

export default nextConfig;