import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import environmentConfig from '../bin/stack-config';
import * as Stack from '../lib/cdk-ses-sns-stack';

const app = new cdk.App();
const stack = new Stack.CdkSesSnsStack(app, 'MyTestStack', environmentConfig);
const template = Template.fromStack(stack);

test('role', () => {
  template.hasResourceProperties('AWS::IAM::Role', {
    RoleName: 'sesRole',
    Description: 'Role for sending and receiving emails with ses',
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'lambda.amazonaws.com',
          },
        },
      ],
    },
  });
  template.hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement:     [
        {
          Action: [
            'lambda:InvokeFunction',
            'ses:*',
            'sns:Publish',
            'sns:Subscribe',
            'route53:GetHostedZone',
            'route53:ChangeResourceRecordSets',
            'route53:TestDNSAnswer',
          ],
          Effect: 'Allow',
          Resource: '*',
        },
      ],
    },
  });
});

test('topic', () => {
  template.hasResourceProperties('AWS::SNS::Topic', {
    TopicName: 'ses-topic',
  });
  template.hasResourceProperties('AWS::SNS::Subscription', {
    Protocol: 'email',
    Endpoint: 'pocketbattlesar@gmail.com',
  });
});

test('verifieddomainidentity', () => {
  const resource = JSON.stringify({ 
    service:'SES',
    action:'verifyDomainIdentity',
    parameters:{ Domain:'pocketbattlesar.com' },
    physicalResourceId:{ responsePath:'VerificationToken' },
  });
  template.hasResourceProperties('Custom::AWS',     {
    Create: resource,
  });
  template.hasResourceProperties('AWS::IAM::Policy',     {
    PolicyDocument: {
      Statement:     [
        {
          Action: 'email:VerifyDomainIdentity',
          Effect: 'Allow',
          Resource: '*',
        },
      ],
    },
  });
});

test('lambda', () => {
  template.hasResourceProperties('AWS::Lambda::Function', {
    FunctionName: 'ses-domain-verifier',
  });
});

test('recordsets', () => {
  template.hasResourceProperties('AWS::Route53::RecordSet', {
    Name: '_amazonses.pocketbattlesar.com.',
    Type: 'TXT',
  });
  template.hasResourceProperties('AWS::Route53::RecordSet', {
    Name: 'pocketbattlesar.com.',
    Type: 'MX',
    ResourceRecords: [ '10 inbound-smtp.eu-west-1.amazonaws.com' ],
  });
});

test('receiptruleset', () => {
  template.hasResourceProperties('AWS::SES::ReceiptRuleSet', {
    RuleSetName: 'sesToSnsRuleSet',
  });
  template.hasResourceProperties('AWS::SES::ReceiptRule', {
    Rule: {
      Actions: [{ 
        SNSAction: {
          Encoding: 'Base64',
        },
      }],
      Enabled: true,
      Name: 'sesToSns',
      Recipients: [],
    },
  });
});
