#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { EdaStack } from '../lib/eda-stack'
import 'dotenv/config'

const app = new cdk.App()
new EdaStack(app, 'EdaStack', {
  env: {
    account: process.env.AWS_ACCOUNT,
    region: process.env.AWS_REGION,
  },
})
