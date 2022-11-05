import * as cdk from "aws-cdk-lib";
import { SecretValue } from "aws-cdk-lib";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import {
  REFLECT_DEV_ACCOUNT,
  REFLECT_PROD_ACCOUNT,
  REFLECT_STAGING_ACCOUNT,
} from "./aws-accounts";
import { CodeConveyorStage } from "./codeconveyor-stage";
import {
  DevEnvironmentSettings,
  ProdEnvironmentSettings,
  StagingEnvironmentSettings,
} from "./environment-settings";

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "CodeConveyorPipeline",
      crossAccountKeys: true,

      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("nielmclaren/CodeConveyor", "main", {
          authentication: SecretValue.secretsManager("CodeConveyorGithubToken"),
        }),
        commands: [
          "cd infrastructure",
          "npm ci",
          "npm run build",
          "npx cdk synth",
        ],
        primaryOutputDirectory: "infrastructure/cdk.out",
      }),
    });

    pipeline.addStage(
      new CodeConveyorStage(this, "Dev", new DevEnvironmentSettings(), {
        env: { account: REFLECT_DEV_ACCOUNT, region: "us-west-2" },
      })
    );

    pipeline.addStage(
      new CodeConveyorStage(this, "Stage", new StagingEnvironmentSettings(), {
        env: { account: REFLECT_STAGING_ACCOUNT, region: "us-west-2" },
      })
    );

    pipeline.addStage(
      new CodeConveyorStage(this, "Prod", new ProdEnvironmentSettings(), {
        env: { account: REFLECT_PROD_ACCOUNT, region: "us-west-2" },
      })
    );
  }
}
