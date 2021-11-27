module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  images: {
    domains: ["arweave.net"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/get-holders",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/:any*",
        destination: "/",
      },
    ];
  },
};
