/// <reference path="../@types/serverless-http.d.ts" />
import * as serverless from 'serverless-http'
import { APIGatewayProxyHandler } from 'aws-lambda';
import app from './app'

const SERVICE_PORT = process.env.SERVICE_PORT || 3000

if (!module.parent) {
  app.listen(SERVICE_PORT)
  console.info('Server runnning on port', SERVICE_PORT)
}

export const toggl: APIGatewayProxyHandler = serverless(app)

