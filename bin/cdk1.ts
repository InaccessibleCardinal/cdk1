#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AppApi } from '../lib/AppApi';

const app = new cdk.App();
new AppApi(app, 'AppApiStack', {
  env: { account: '859364602191', region: 'us-west-2' },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
