export default {
    port: process.env.PORT || 5001,
    jwtSecret: process.env.JWT_SECRET || 'secret',
    mongoUri: process.env.DATABASE_URL || 'mongodb://localhost:27017/test'
}