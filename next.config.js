// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }
//
// module.exports = nextConfig
//

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatar.vercel.sh', 'lh3.googleusercontent.com', 'ipfs.io'],
  },
}

module.exports = nextConfig
