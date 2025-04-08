/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: process.env.NEXT_BASEPATH,
    reactStrictMode: false,
    compress: true,
    output: 'export',
    trailingSlash: true
}

module.exports = nextConfig
