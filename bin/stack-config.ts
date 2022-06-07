import { ICdkSesSnsStackProps } from './stack-environment-types';

const devEnvironmentConfig: ICdkSesSnsStackProps = {
  tags: {
    Developer: 'Faruk Ada',
    Application: 'CdkSesSns',
  },
  environment: 'dev',
  roleName: 'sesRole',
  roleDescription: 'Role for sending and receiving emails with ses',
  topicName: 'ses-topic',
  receivingEmail: 'email@gmail.com',
  domain: 'domain.com',
  hostedZoneId: 'ABCDEFGHIJ123456789',
  functionName: 'ses-domain-verifier',
  receiptRuleSetName: 'sesToSnsRuleSet',
};

export default devEnvironmentConfig;