import {
  aws_apigateway,
  aws_certificatemanager,
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_iam,
  aws_lambda,
  aws_lambda_nodejs,
  aws_route53_targets,
  aws_s3,
  aws_s3_deployment,
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { AliasRecord } from "./aliasRecord";
import { IEnvironmentSettings } from "./EnvironmentSettings";

export class CodeConveyorStack extends Stack {
  public readonly urlOutput: CfnOutput;

  constructor(scope: Construct, id: string, envSettings: IEnvironmentSettings, props?: StackProps) {
    super(scope, id, props);

    const api = this.createApi(envSettings);
    this.createSpa(envSettings);

    this.urlOutput = new CfnOutput(this, "Url", { value: api.url });
  }

  private createApi(envSettings: IEnvironmentSettings): aws_apigateway.LambdaRestApi {
    const certificate = aws_certificatemanager.Certificate.fromCertificateArn(
      this,
      "nielmclarenCertificate",
      envSettings.certificateArn
    );

    const hello = new aws_lambda.Function(this, "HelloHandler", {
      runtime: aws_lambda.Runtime.NODEJS_14_X,
      code: aws_lambda.Code.fromAsset("lambda"),
      handler: "hello.handler",
    });

    const api = new aws_apigateway.LambdaRestApi(this, "CodeConveyorApiEndpoint", {
      handler: hello,
      domainName: {
        certificate,
        domainName: envSettings.apiDomainName,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: [`https://${envSettings.spaDomainName}`],
      },
    });

    this.createApiAliasRecord(envSettings, api);

    return api;
  }

  private createSpa(envSettings: IEnvironmentSettings): void {
    const certificate = aws_certificatemanager.Certificate.fromCertificateArn(
      this,
      "nielmclarenCloudFrontCertificate",
      envSettings.cloudFrontCertificateArn
    );

    const siteBucket = new aws_s3.Bucket(this, `SpaBucket-CodeConveyor${envSettings.environmentName}`, {
      bucketName: `code-conveyor-${envSettings.environmentName.toLowerCase()}-spa`,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const originAccessIdentity = new aws_cloudfront.OriginAccessIdentity(
      this,
      `OriginAccessIdentity-CodeConveyor${envSettings.environmentName}`,
      { comment: "Setup access from CloudFront to the SPA bucket (read)" }
    );
    siteBucket.grantRead(originAccessIdentity);

    const dist = new aws_cloudfront.Distribution(this, `SpaDistribution-CodeConveyor${envSettings.environmentName}`, {
      certificate,
      defaultRootObject: "index.html",
      domainNames: [envSettings.spaDomainName],
      minimumProtocolVersion: aws_cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 403,
          responsePagePath: "/error.html",
          ttl: Duration.minutes(30),
        },
      ],
      defaultBehavior: {
        origin: new aws_cloudfront_origins.S3Origin(siteBucket, { originAccessIdentity }),
        compress: true,
        allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
    });

    const deployment = new aws_s3_deployment.BucketDeployment(
      this,
      `SpaAssets-CodeConveyor${envSettings.environmentName}`,
      {
        sources: [aws_s3_deployment.Source.asset("./spa")],
        destinationBucket: siteBucket,
        distribution: dist,
      }
    );

    this.createSpaAliasRecord(envSettings, dist);
  }

  private createApiAliasRecord(envSettings: IEnvironmentSettings, api: aws_apigateway.LambdaRestApi): void {
    new AliasRecord(this, `ApiAliasRecord-CodeConveyor${envSettings.environmentName}`, {
      hostedZoneDelegationRoleArn: envSettings.hostedZoneDelegationRoleArn,
      sourceDomainName: envSettings.apiDomainName,
      sourceHostedZoneName: envSettings.apiDomainName,
      targetAliasDomainName: api.domainName!.domainNameAliasDomainName,
      targetHostedZoneId: api.domainName!.domainNameAliasHostedZoneId,
    });
  }

  private createSpaAliasRecord(envSettings: IEnvironmentSettings, cloudFrontDist: aws_cloudfront.IDistribution): void {
    // This is always the hosted zone ID for a CloudFront distribution.
    const cloudFrontHostedZoneId = "Z2FDTNDATAQYW2";

    new AliasRecord(this, `SpaAliasRecord-CodeConveyor${envSettings.environmentName}`, {
      hostedZoneDelegationRoleArn: envSettings.hostedZoneDelegationRoleArn,
      sourceDomainName: envSettings.spaDomainName,
      sourceHostedZoneName: envSettings.spaDomainName,
      targetAliasDomainName: cloudFrontDist.distributionDomainName,
      targetHostedZoneId: cloudFrontHostedZoneId,
    });
  }
}
