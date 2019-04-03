import app from './app'

const SERVICE_PORT = process.env.SERVICE_PORT || 3000

if (!module.parent) {
  app.listen(SERVICE_PORT)
  console.info('Server runnning on port', SERVICE_PORT)
}
