// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt','nuxt-icon',
    '@vueuse/nuxt','nuxt-swiper'
  ],
  swiper: {
    prefix: 'Swiper',
    modules: ['zoom'],
  },
  runtimeConfig:{
    MONGO_URL:process.env.MONGO_URL    ,  
    HASH_ROUND:process.env.HASH_ROUND    ,  
    SECRET_KEY:process.env.SECRET_KEY    ,  
    AUTH_ORIGIN:process.env.AUTH_ORIGIN,
  },
  plugins:[
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}, 
    },
  },
  ssr:true,
  css: ["~/assets/main.css" , '@fortawesome/fontawesome-svg-core/styles.css'],
  devtools: { enabled: false },
  nitro:{
    plugins:["~/server/db/index.js"]   
  }
});
