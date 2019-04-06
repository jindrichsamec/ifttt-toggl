import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as logger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'
import { startTimeEntry, getCurrentTimeEntry, stopTimeEntry } from './toggl'

const IFTTT_LOCATION_ENTERED = 'entered'
const IFTTT_LOCATION_EXITED = 'exited'

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
  if (!projectId || !description) {
    ctx.status = 400
    return;
  }

  const timeEntry = await startTimeEntry(clientSecret, description, projectId)
  ctx.body = timeEntry
  ctx.status = 200
  console.log('Time entry started', timeEntry)
});

router.post('/off', async (ctx: Koa.Context): Promise<void> => {
  console.log('Stopping time entry')
  const { clientSecret } = ctx.request.body
  const currentTimeEntry = await getCurrentTimeEntry(clientSecret)
  await stopTimeEntry(clientSecret, currentTimeEntry.data.id)
  ctx.body = currentTimeEntry
  ctx.status = 200
  console.log('Time entry stopped', currentTimeEntry)
})

router.post('/toggle', async (ctx: Koa.Context): Promise<void> => {
  console.log('Starting time entry')
  const { clientSecret, action, projectId, description } = ctx.request.body
  ctx.status = 200
  if (action === IFTTT_LOCATION_ENTERED && projectId && description) {
    const timeEntry = await startTimeEntry(clientSecret, description, projectId)
    ctx.body = timeEntry
  } else if (action === IFTTT_LOCATION_EXITED) {
    const currentTimeEntry = await getCurrentTimeEntry(clientSecret)
    await stopTimeEntry(clientSecret, currentTimeEntry.data.id)
    ctx.body = currentTimeEntry
  } else {
    ctx.status === 400
  }
});

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
