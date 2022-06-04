import { Duration, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';

// extended stack environment props
import { ICdkSesSnsStackProps } from '../bin/stack-environment-types';

export class CdkSesSnsStack extends Stack {
  constructor(scope: Construct, id: string, props: ICdkSesSnsStackProps) {
    super(scope, id, props);

    // example resource
    new sqs.Queue(this, 'Queue', {
      queueName: 'testName',
      visibilityTimeout: Duration.seconds(300),
    });
  }
}
