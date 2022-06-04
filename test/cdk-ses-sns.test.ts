import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import devEnvironmentConfig from '../bin/dev-stack-config';
import * as Stack from '../lib/cdk-ses-sns-stack';

// example test.
test('SQS Queue Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Stack.CdkSesSnsStack(app, 'MyTestStack', devEnvironmentConfig);
  // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::SQS::Queue', {
    VisibilityTimeout: 300,
    QueueName: 'testName',
  });
});
