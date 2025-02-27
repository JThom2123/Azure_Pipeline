/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Ensure proper aliasing for AWS Amplify imports
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@/aws-exports": require.resolve("./aws-exports"), // Allows AWS Amplify config import
    };
    return config;
  },

  // Add environment variables for Amplify if needed
  env: {
    NEXT_PUBLIC_REGION: "us-east-1",
    NEXT_PUBLIC_USER_POOL_ID: "us-east-1_SBC9pg6ag",
    NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID: "107720oslv197r2qvlb4h1ptcs",
  },

  // Optimize images (if using Next.js Image component)
  images: {
    domains: ["yourdomain.com", "another-domain.com"], // Add any required domains
  },

  // Remove `swcMinify` as it's no longer a valid option in Next.js 15+
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
