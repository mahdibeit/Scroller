/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: [
      // allow Next.js <Image> to load from Amazon’s CDN:
      "images-na.ssl-images-amazon.com",
      "m.media-amazon.com",
    ],
    // (optional) if you need more control, you can use remotePatterns instead:
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "images-na.ssl-images-amazon.com",
    //     port: "",
    //     pathname: "/**",
    //   },
    // ],
  },
};

export default config;
