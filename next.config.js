const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development', // Enable caching only in production
    buildExcludes: [/middleware-manifest.json$/],  // Exclude middleware manifest
    runtimeCaching: [
        {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'google-fonts',
                expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 30, // Cache for 30 days
                },
            },
        },
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|ttf|woff|woff2|eot)$/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'assets-cache',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24 * 7, // Cache for 7 days
                },
            },
        },
        {
            urlPattern: /^https:\/\/your-api-endpoint\.com\/api\//,
            handler: 'StaleWhileRevalidate',
            options: {
                cacheName: 'api-cache',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24, // Cache API responses for 24 hours
                },
            },
        },
        {
            urlPattern: /.*/,
            handler: 'NetworkFirst', // Fetch from network first, then fallback to cache
            options: {
                cacheName: 'default-cache',
                expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 60 * 60 * 24 * 30, // Cache for 30 days
                },
            },
        },
    ],
})

module.exports = withPWA({
    reactStrictMode: true,
})
