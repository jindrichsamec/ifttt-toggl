import * as Koa from 'koa'
import { startTimeEntry, getCurrentTimeEntry, stopTimeEntry } from './toggl'

const IFTTT_LOCATION_ENTERED = 'entered'
const IFTTT_LOCATION_EXITED = 'exited'

export const handleOn = async (ctx: Koa.Context): Promise<void> => {
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
}

export const handleOff = async (ctx: Koa.Context): Promise<void> => {
  console.log('Stopping time entry')
  const { clientSecret } = ctx.request.body
  const currentTimeEntry = await getCurrentTimeEntry(clientSecret)
  await stopTimeEntry(clientSecret, currentTimeEntry.data.id)
  ctx.body = currentTimeEntry
  ctx.status = 200
  console.log('Time entry stopped', currentTimeEntry)
}

export const handleToggle = async (ctx: Koa.Context): Promise<void> => {
  const { action } = ctx.request.body
  console.log('Toggle time entry', action)
  if (action === IFTTT_LOCATION_ENTERED) {
    return handleOn(ctx)
  } else if (action === IFTTT_LOCATION_EXITED) {
    return handleOff(ctx)
  } else {
    ctx.status === 400
  }
}
