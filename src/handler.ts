/// <reference path="../@types/serverless-http.d.ts" />
import * as serverless from 'serverless-http'
import { APIGatewayProxyHandler } from 'aws-lambda';
import app from './app'

export const toggl: APIGatewayProxyHandler = serverless(app)
