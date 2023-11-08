/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: process.env.NEXT_BASEPATH,
    reactStrictMode: false,
    compress: true,
    output: 'export',
}

module.exports = nextConfig
