import removeImports from "next-remove-imports";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "umesh-local-development.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default removeImports()({
  ...nextConfig,
});
