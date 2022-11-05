import {
  aws_certificatemanager,
  CfnOutput,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
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

    const hello = new lambda.Function(this, "HelloHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "hello.handler",
    });

    const certificate = aws_certificatemanager.Certificate.fromCertificateArn(
      this,
      "nielmclarenCertificate",
      envSettings.certificateArn
    );

    const restApi = new apigw.LambdaRestApi(this, "Endpoint", {
      handler: hello,
      domainName: {
        certificate,
        domainName: envSettings.domainName,
      },
    });

    this.urlOutput = new CfnOutput(this, "Url", { value: restApi.url });
  }
}
