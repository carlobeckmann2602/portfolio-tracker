/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public'
})

const config = {
  reactStrictMode: true,
}

module.exports = withPWA(config)
