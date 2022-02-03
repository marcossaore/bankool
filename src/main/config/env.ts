export default {
  port: process.env.PORT ?? 3000,
  jwtSecret: process.env.JWT_SECRET ?? '6as45e$3#2@pos-%',
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/bankool-api'
}
