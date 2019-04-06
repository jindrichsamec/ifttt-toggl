import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as logger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'
import { handleOn, handleOff, handleToggle } from './requestHandlers'
const app = new Koa()
const router = new Router()

router.get('/', (ctx: Koa.Context) => {
  ctx.response.body = ctx.body = {
    'name': 'toggl',
    'availableAPIs': {
      '/on': 'Start toggl timer',
      '/off': 'Stop toggl timer',
    }
  }
})
router.post('/on', handleOn);
router.post('/off', handleOff)
router.post('/toggle', handleToggle);

app.use(logger())
app.use(bodyParser())
app.use(async (ctx: Koa.Context, next: Function) => {
    const { clientSecret } = ctx.request.body
   if (!clientSecret) {
     ctx.response.status = 400
     return
   }
   console.log('Client secret', clientSecret)
   await next()
})
app.use(router.routes())

export default app
