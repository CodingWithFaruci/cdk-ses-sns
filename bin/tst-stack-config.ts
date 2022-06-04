import { ICdkSesSnsStackProps } from './stack-environment-types';

const tstEnvironmentConfig: ICdkSesSnsStackProps = {
  tags: {
    Developer: 'Faruk Ada',
    Application: 'CdkSesSns',
  },
  environment: 'tst',
};

export default tstEnvironmentConfig;