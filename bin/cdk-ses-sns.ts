#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkSesSnsStack } from '../lib/cdk-ses-sns-stack';

// importing configuration based on environment
import devEnvironmentConfig from './dev-stack-config';
import tstEnvironmentConfig from './tst-stack-config';
import prdEnvironmentConfig from './prd-stack-config';

const app = new cdk.App();

// injecting configurations into stack based on environment.
new CdkSesSnsStack(app, 'cdk-ses-sns-dev', devEnvironmentConfig);
new CdkSesSnsStack(app, 'cdk-ses-sns-tst', tstEnvironmentConfig);
new CdkSesSnsStack(app, 'cdk-ses-sns-prd', prdEnvironmentConfig);