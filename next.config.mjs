/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // 기존 설정 유지
    output: 'export',      // 정적 파일 생성 설정 추가
    assetPrefix: './',     // GitHub Pages에서 정적 파일 경로를 맞추기 위한 상대 경로 설정
};

export default nextConfig;

