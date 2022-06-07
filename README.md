# AWS CDK TypeScript Bootstrap

This repository contains a SES mail domain with SNS Topic that redirects to desired email.
Additionally this stack adds Route53 records on the domain and verifies it with a custom lambda resource.

## Useful commands

| Command  | Description    |
|----------|----------------|
|`npm run build`|compile typescript to js|
|`npm run test`|perform the jest unit tests|
|`npm run lint`|perform static analyses on code|
|`cdk bootstrap`|bootstrap aws for cdk on first time using cdk|
|`cdk diff`|compare deployed stack with current state|
|`cdk synth`|emits the synthesized CloudFormation template|
|`cdk deploy`| deploy this stack to your default AWS account/region|
