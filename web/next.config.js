/** @type {import('next').NextConfig} */

const runtimeCaching = require('next-pwa/cache')

const withPWA = require('next-pwa')({
  dest: 'public',
  runtimeCaching: [
    {
      urlPattern: ({url}) => {
        return url.pathname === '/stocks'
      },
      handler: 'NetworkFirst',
      options: {
        cacheName: 'stocks',
        expiration: {
          maxEntries: 1024,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        },
        networkTimeoutSeconds: 2/10
      }
    },
    ...runtimeCaching
  ]
})

const config = {
  reactStrictMode: true,
}

module.exports = withPWA(config)
