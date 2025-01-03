export default defineNuxtConfig({
  // Disable devtools temporarily
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      huggingFaceApiKey: process.env.HUGGINGFACE_API_KEY,
    },
    mongodbUri: process.env.MONGODB_URI,
  },

  
  components: [
    '~/components',
    '~/components/common'
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  typescript: {
    strict: true,
    typeCheck: false
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'AI-Classroom',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'AI-powered learning platform for personalized education' },
        { name: 'theme-color', content: '#0EA5E9' },
        { name: 'og:title', content: 'AI-Classroom' },
        { name: 'og:description', content: 'AI-powered learning platform for personalized education' },
        { name: 'og:type', content: 'website' }
      ],
      script: [
        {
          src: "https://accounts.google.com/gsi/client",
          async: true,
          defer: true
        }
      ],
      link: [
        { 
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg'
        },
        { 
          rel: 'alternate icon', 
          href: '/favicon.ico'
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png'
      }
      ]
    }
  },

  compatibilityDate: '2024-12-03'
})

