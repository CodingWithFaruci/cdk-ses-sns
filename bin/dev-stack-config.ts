import { ICdkSesSnsStackProps } from './stack-environment-types';

const devEnvironmentConfig: ICdkSesSnsStackProps = {
  tags: {
    Developer: 'Faruk Ada',
    Application: 'CdkSesSns',
  },
  environment: 'dev',
};

export default devEnvironmentConfig;