import { ICdkSesSnsStackProps } from './stack-environment-types';

const prdEnvironmentConfig: ICdkSesSnsStackProps = {
  tags: {
    Developer: 'Faruk Ada',
    Application: 'CdkSesSns',
  },
  environment: 'prd',
};

export default prdEnvironmentConfig;