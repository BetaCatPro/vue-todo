const Koa = require('koa')

const app = new Koa()

const isDev = process.env.NODE_ENV === 'development'

app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        ctx.status = 500
        if(isDev) {
            ctx.body = err.message
        } else {
            ctx.body = 'please try gaain later'
        }
    }
})

