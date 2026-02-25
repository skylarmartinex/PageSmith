/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // pptxgenjs uses Node.js built-ins via both bare names and `node:` URI scheme.
      // Stub them out in the client bundle.
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        https: false,
        http: false,
        net: false,
        tls: false,
        stream: false,
        zlib: false,
        path: false,
        crypto: false,
        os: false,
        url: false,
        util: false,
        events: false,
        buffer: false,
        process: false,
      };

      // Handle `node:` URI scheme (Node 18+ native module references)
      // NormalModuleReplacementPlugin intercepts the module request before resolution
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^node:/,
          (resource) => {
            // Strip the `node:` prefix and let the fallback above handle it
            resource.request = resource.request.replace(/^node:/, '');
          }
        )
      );
    }
    return config;
  },
}

module.exports = nextConfig
