export interface IEnvironmentSettings {
  apiDomainName: string;
  apiHostedZoneId: string;
  certificateArn: string;
  cloudFrontCertificateArn: string; // CloudFront can only use certificates issued in us-east-1.
  environmentName: string;
  hostedZoneDelegationRoleArn: string;
  spaDomainName: string;
  spaHostedZoneId: string;
}

export class DevEnvironmentSettings {
  public apiDomainName = "codeconveyor-api-dev.nielmclaren.com";
  public apiHostedZoneId = "Z0680943349ZC50NSIHSH";
  public certificateArn = "arn:aws:acm:us-west-2:510650182850:certificate/441a45e2-d5e7-46ff-9c8f-0e8e71b23cd0";
  public cloudFrontCertificateArn =
    "arn:aws:acm:us-east-1:510650182850:certificate/17909a60-86da-4979-a8a1-0ffaad952cb5";
  public environmentName = "Dev";
  public hostedZoneDelegationRoleArn = "arn:aws:iam::695408758741:role/CodeConveyorDevHostedZoneDelegationRole";
  public spaDomainName = "codeconveyor-dev.nielmclaren.com";
  public spaHostedZoneId = "Z0218694NEV5099VXAC7";
}

export class StagingEnvironmentSettings {
  public apiDomainName = "codeconveyor-api-staging.nielmclaren.com";
  public apiHostedZoneId = "Z004505022VU1UZSVXS9O";
  public certificateArn = "arn:aws:acm:us-west-2:933497984357:certificate/d2909517-9af4-45ed-a4da-03a804a9cdae";
  public cloudFrontCertificateArn =
    "arn:aws:acm:us-east-1:933497984357:certificate/c35a6981-9476-4b10-850b-4946e1a417a3";
  public environmentName = "Staging";
  public hostedZoneDelegationRoleArn = "arn:aws:iam::695408758741:role/CodeConveyorStagingHostedZoneDelegationRole";
  public spaDomainName = "codeconveyor-staging.nielmclaren.com";
  public spaHostedZoneId = "Z0219638EU4EW4HITSRN";
}

export class ProdEnvironmentSettings {
  public apiDomainName = "codeconveyor-api.nielmclaren.com";
  public apiHostedZoneId = "Z07262761AJ5JYX85WQC9";
  public certificateArn = "arn:aws:acm:us-west-2:858585152460:certificate/0116a88b-23f6-4d9c-939a-6e052202ea26";
  public cloudFrontCertificateArn =
    "arn:aws:acm:us-east-1:858585152460:certificate/5e02b201-473e-40e7-97a3-4d071aa1fa41";
  public environmentName = "Prod";
  public hostedZoneDelegationRoleArn = "arn:aws:iam::695408758741:role/CodeConveyorProdHostedZoneDelegationRole";
  public spaDomainName = "codeconveyor.nielmclaren.com";
  public spaHostedZoneId = "Z0822064YJYICQ30VG4";
}
