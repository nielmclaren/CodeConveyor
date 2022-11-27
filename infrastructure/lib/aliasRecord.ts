import { aws_iam, aws_lambda_nodejs, CustomResource, custom_resources } from "aws-cdk-lib";
import { Construct } from "constructs";
import { IEnvironmentSettings } from "./EnvironmentSettings";

export interface AliasRecordProps {
  hostedZoneDelegationRoleArn: string;
  sourceDomainName: string;
  sourceHostedZoneName: string;
  targetAliasDomainName: string;
  targetHostedZoneId: string;
}

export class AliasRecord extends Construct {
  constructor(scope: Construct, id: string, props: AliasRecordProps) {
    super(scope, id);

    const {
      hostedZoneDelegationRoleArn: delegationRoleArn,
      sourceDomainName: domain,
      sourceHostedZoneName: zoneName,
      targetAliasDomainName,
      targetHostedZoneId,
    } = props;

    const onEventHandler = new aws_lambda_nodejs.NodejsFunction(
      this,
      "Lambda", // Associate with Lambda code in aliasRecord.Lambda.ts.
      {
        initialPolicy: [
          new aws_iam.PolicyStatement({
            actions: ["sts:AssumeRole"],
            resources: ["*"],
          }),
        ],
      }
    );

    const provider = new custom_resources.Provider(this, `Provider${id}`, {
      onEventHandler,
    });

    new CustomResource(this, `CustomResource-${id}`, {
      serviceToken: provider.serviceToken,
      properties: {
        domain,
        zoneName,
        targetAlias: targetAliasDomainName,
        targetHostedZoneId,
        delegationRoleArn,
      },
    });
  }
}
