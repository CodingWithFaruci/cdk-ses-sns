import { StackProps } from 'aws-cdk-lib';

export interface ICdkSesSnsStackProps extends StackProps {
  environment: string,
  roleName: string,
  roleDescription: string,
  topicName: string,
  receivingEmail: string,
  domain: string,
  hostedZoneId: string,
  functionName: string,
  receiptRuleSetName: string,
}