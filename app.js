require('./fontconfig')()

const logger = require('koa-logger')
const responseTime = require('koa-response-time')
const bodyParser = require('koa-bodyparser')
const ratelimit = require('koa-ratelimit')
const Router = require('koa-router')
const Koa = require('koa')
const { loadFonts } = require('./utils')
const site = require('./site')

const app = new Koa()
let fontsReady

app.use(logger())
app.use(responseTime())
app.use(bodyParser())

const ratelimitDb = new Map()

app.use(ratelimit({
  driver: 'memory',
  db: ratelimitDb,
  duration: 1000 * 55,
  errorMessage: {
    ok: false,
    error: {
      code: 429,
      message: 'Rate limit exceeded. See "Retry-After"'
    }
  },
  id: (ctx) => ctx.ip,
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total'
  },
  max: 20,
  disableHeader: false,
  whitelist: (ctx) => {
    return ctx.query.botToken === process.env.BOT_TOKEN
  },
  blacklist: (ctx) => {
  }
}))

app.use(require('./helpers').helpersApi)

const route = new Router()

const routes = require('./routes')

function apiInfo (ctx) {
  const origin = ctx.origin

  ctx.status = 200
  ctx.body = {
    ok: true,
    name: 'shnwazdev-quoteapi',
    status: 'running',
    endpoints: {
      health: `${origin}/health`,
      generate: `${origin}/generate`,
      generatePng: `${origin}/generate.png`,
      generateWebp: `${origin}/generate.webp`,
      legacyGenerate: `${origin}/quote/generate`,
      legacyGeneratePng: `${origin}/quote/generate.png`,
      legacyGenerateWebp: `${origin}/quote/generate.webp`
    },
    usage: {
      method: 'POST',
      contentType: 'application/json',
      body: {
        messages: [
          {
            from: { id: 1, name: 'User' },
            text: 'Hello world'
          }
        ]
      }
    }
  }
}

// Health check endpoint for Docker/Coolify
route.get('/health', (ctx) => {
  ctx.status = 200
  ctx.body = { status: 'ok', timestamp: Date.now() }
})

route.get('/', (ctx) => site.sendHtml(ctx, site.landingPage(ctx)))
route.get('/docs', (ctx) => site.sendHtml(ctx, site.docsPage(ctx)))
route.get('/brand.png', site.sendBrandImage)
route.get('/favicon.ico', site.sendBrandImage)
route.get('/generate', apiInfo)
route.get('/generate.png', apiInfo)
route.get('/generate.webp', apiInfo)
route.get('/quote/generate', apiInfo)
route.get('/quote/generate.png', apiInfo)
route.get('/quote/generate.webp', apiInfo)

route.use('/*', routes.routeApi.routes())

app.use(route.routes())

const port = process.env.PORT || 3000

function prepare () {
  if (!fontsReady) {
    fontsReady = loadFonts()
  }
  return fontsReady
}

async function start () {
  await prepare()
  app.listen(port, () => {
    console.log('Listening on localhost, port', port)
  })
}

if (require.main === module) {
  start()
}

module.exports = {
  app,
  prepare,
  start
}
