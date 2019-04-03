import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as logger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'
import { startTimeEntry, getCurrentTimeEntry, stopTimeEntry } from './toggl'

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
router.post('/on', async (ctx: Koa.Context): Promise<void> => {
  console.log('Starting time entry')
  const { clientSecret, projectId, description } = ctx.request.body
  const response = await startTimeEntry(clientSecret, projectId, description)
  ctx.body = response
  ctx.status = 200
  console.log('Time entry started', response)
});

router.post('/off', async (ctx: Koa.Context): Promise<void> => {
  console.log('Stopping time entry')
  const currentTimeEntry = await getCurrentTimeEntry(ctx.clientSecret)
  await stopTimeEntry(ctx.clientSecret, currentTimeEntry.data.id)
  ctx.body = currentTimeEntry
  ctx.status = 200
  console.log('Time entry stopped', currentTimeEntry)
})

app.use(logger())
app.use(bodyParser())
app.use(async (ctx, next) => {
   ctx.clientSecret = ctx.request.body.clientSecret
   console.log('Client secret', ctx.clientSecret)
   await next()
})
app.use(router.routes())

export default app
