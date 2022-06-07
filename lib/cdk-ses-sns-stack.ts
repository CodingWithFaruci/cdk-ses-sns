import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as crs from 'aws-cdk-lib/custom-resources';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as snsmail  from 'aws-cdk-lib/aws-sns-subscriptions';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as sesactions from 'aws-cdk-lib/aws-ses-actions';

// extended stack environment props
import { ICdkSesSnsStackProps } from '../bin/stack-environment-types';

export class CdkSesSnsStack extends Stack {
  constructor(scope: Construct, id: string, props: ICdkSesSnsStackProps) {
    super(scope, id, props);


    /**
     * @role Creating a role for using amazone ses, sns and route53.
     */
    const role = new iam.Role(this, 'ses-role', {
      roleName: props.roleName,
      description: props.roleDescription,
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('lambda.amazonaws.com'),
      ),
    });

    // adding policy permissions on the resources.
    role.addToPolicy(
      new iam.PolicyStatement({
        resources: ['*'],
        actions: [
          'lambda:InvokeFunction',
          'ses:*',
          'sns:Publish',
          'sns:Subscribe',
          'route53:GetHostedZone',
          'route53:ChangeResourceRecordSets',
          'route53:TestDNSAnswer',
        ],
      }),
    );

    /**
     * @topic Creating a topic for sending emails with ses.
     */
    const topic = new sns.Topic(this, 'ses-topic', {
      topicName: props.topicName,
    });

    // adding email subscription on sns topic.
    topic.addSubscription(
      new snsmail.EmailSubscription(props.receivingEmail),
    );

    // Get the hosted zone for ses.
    const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'hosted-zone', {
      zoneName: props.domain,
      hostedZoneId: props.hostedZoneId,
    });

    /**
     * @verifiedDomainIdentity Creating a custom resource for verifying the domain identity.
     */
    const verifiedDomainIdentity = new crs.AwsCustomResource(this, 'verified-domain-identity', {
      functionName: props.functionName,
      onCreate: {
        service: 'SES',
        action: 'verifyDomainIdentity',
        parameters: {
          Domain: props.domain,
        },
        physicalResourceId: crs.PhysicalResourceId.fromResponse('VerificationToken'),
      },
      policy: crs.AwsCustomResourcePolicy.fromSdkCalls({
        resources: crs.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
      role,
    });

    // Adding a txt and mx record on the domain.
    new route53.TxtRecord(this, 'ses-txt-record', {
      zone,
      recordName: `_amazonses.${props.domain}`,
      values: [verifiedDomainIdentity.getResponseField('VerificationToken')],
    });
    new route53.MxRecord(this, 'ses-mx-record', {
      values: [{
        hostName: 'inbound-smtp.eu-west-1.amazonaws.com',
        priority: 10,
      }],
      zone,
    });

    // Adding ruleset for all email to domain.    
    new ses.ReceiptRuleSet(this, 'ses-rule-set', {
      receiptRuleSetName: props.receiptRuleSetName,
      rules: [
        {
          receiptRuleName: 'sesToSns',
          recipients: [],
          actions: [
            new sesactions.Sns({
              topic,
              encoding: sesactions.EmailEncoding.BASE64,
            }),
          ],
          enabled: true,
        },
      ],
    });
  }
}
