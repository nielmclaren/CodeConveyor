import {
  aws_apigateway,
  aws_certificatemanager,
  aws_iam,
  aws_lambda,
  aws_lambda_nodejs,
  CfnOutput,
  CustomResource,
  custom_resources,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { IEnvironmentSettings } from "./environment-settings";

export class CodeConveyorStack extends Stack {
  public readonly urlOutput: CfnOutput;

  constructor(
    scope: Construct,
    id: string,
    envSettings: IEnvironmentSettings,
    props?: StackProps
  ) {
    super(scope, id, props);

    const hello = new aws_lambda.Function(this, "HelloHandler", {
      runtime: aws_lambda.Runtime.NODEJS_14_X,
      code: aws_lambda.Code.fromAsset("lambda"),
      handler: "hello.handler",
    });

    const certificate = aws_certificatemanager.Certificate.fromCertificateArn(
      this,
      "nielmclarenCertificate",
      envSettings.certificateArn
    );

    const restApi = new aws_apigateway.LambdaRestApi(
      this,
      "CodeConveyorApiEndpoint",
      {
        handler: hello,
        domainName: {
          certificate,
          domainName: envSettings.apiDomainName,
        },
      }
    );

    this.createAliasRecords(envSettings, restApi);

    this.urlOutput = new CfnOutput(this, "Url", { value: restApi.url });
  }

  private createAliasRecords(
    envSettings: IEnvironmentSettings,
    restApi: aws_apigateway.LambdaRestApi
  ): void {
    const onEventHandler = new aws_lambda_nodejs.NodejsFunction(
      this,
      "AliasRecord", // Associate with Lambda code in codeconveyor-stack.AliasRecord.ts.
      {
        initialPolicy: [
          new aws_iam.PolicyStatement({
            actions: ["sts:AssumeRole"],
            resources: ["*"],
          }),
        ],
      }
    );
    const provider = new custom_resources.Provider(
      this,
      `AliasRecordProvider-CodeConveyor${envSettings.environmentName}`,
      {
        onEventHandler,
      }
    );
    new CustomResource(
      this,
      `AliasRecordCustomResource-CodeConveyor${envSettings.environmentName}`,
      {
        serviceToken: provider.serviceToken,
        properties: {
          zoneName: envSettings.apiDomainName,
          domain: envSettings.apiDomainName,
          targetAlias: restApi.domainName?.domainNameAliasDomainName,
          targetHostedZoneId: restApi.domainName?.domainNameAliasHostedZoneId,
          delegationRoleArn: envSettings.hostedZoneDelegationRoleArn,
        },
      }
    );
  }
}
