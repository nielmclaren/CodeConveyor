export interface IEnvironmentSettings {
  certificateArn: string;
  domainName: string;
}

export class DevEnvironmentSettings {
  public certificateArn =
    "arn:aws:acm:us-west-2:510650182850:certificate/441a45e2-d5e7-46ff-9c8f-0e8e71b23cd0";
  public domainName = "codeconveyor-api-dev.nielmclaren.com";
}

export class StagingEnvironmentSettings {
  public certificateArn =
    "arn:aws:acm:us-west-2:933497984357:certificate/d2909517-9af4-45ed-a4da-03a804a9cdae";
  public domainName = "codeconveyor-api-staging.nielmclaren.com";
}

export class ProdEnvironmentSettings {
  public certificateArn =
    "arn:aws:acm:us-west-2:858585152460:certificate/0116a88b-23f6-4d9c-939a-6e052202ea26";
  public domainName = "codeconveyor-api.nielmclaren.com";
}
