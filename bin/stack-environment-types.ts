import { StackProps } from 'aws-cdk-lib';

export interface ICdkSesSnsStackProps extends StackProps {
  environment: string
}