export interface IEnvironmentSettings {
  apiDomainName: string;
  apiHostedZoneId: string;
  certificateArn: string;
  environmentName: string;
  hostedZoneDelegationRoleArn: string;
}

export class DevEnvironmentSettings {
  public apiDomainName = "codeconveyor-api-dev.nielmclaren.com";
  public apiHostedZoneId = "Z0680943349ZC50NSIHSH";
  public certificateArn =
    "arn:aws:acm:us-west-2:510650182850:certificate/441a45e2-d5e7-46ff-9c8f-0e8e71b23cd0";
  public environmentName = "Dev";
  public hostedZoneDelegationRoleArn =
    "arn:aws:iam::695408758741:role/Route53NSRecordCreationRole-CodeConveyorDev";
}

export class StagingEnvironmentSettings {
  public apiDomainName = "codeconveyor-api-staging.nielmclaren.com";
  public apiHostedZoneId = "Z004505022VU1UZSVXS9O";
  public certificateArn =
    "arn:aws:acm:us-west-2:933497984357:certificate/d2909517-9af4-45ed-a4da-03a804a9cdae";
  public environmentName = "Staging";
  public hostedZoneDelegationRoleArn =
    "arn:aws:iam::695408758741:role/Route53NSRecordCreationRole-CodeConveyorStaging";
}

export class ProdEnvironmentSettings {
  public apiDomainName = "codeconveyor-api.nielmclaren.com";
  public apiHostedZoneId = "Z07262761AJ5JYX85WQC9";
  public certificateArn =
    "arn:aws:acm:us-west-2:858585152460:certificate/0116a88b-23f6-4d9c-939a-6e052202ea26";
  public environmentName = "Prod";
  public hostedZoneDelegationRoleArn =
    "arn:aws:iam::695408758741:role/Route53NSRecordCreationRole-CodeConveyorProd";
}
