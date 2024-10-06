/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/educations",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
