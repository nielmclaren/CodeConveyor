import assert = require("assert");
import * as cdk from "aws-cdk-lib";
import { SecretValue } from "aws-cdk-lib";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { REFLECT_DEV_ACCOUNT, REFLECT_PROD_ACCOUNT, REFLECT_STAGING_ACCOUNT } from "./AwsAccounts";
import { PipelineStackProps } from "./PipelineStackProps";
import { CodeConveyorStage } from "./CodeConveyorStage";
import { DevEnvironmentSettings, ProdEnvironmentSettings, StagingEnvironmentSettings } from "./EnvironmentSettings";

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const { branchName } = props;

    const pipeline = new CodePipeline(this, `CodeConveyorPipeline-${branchName}`, {
      pipelineName: `CodeConveyorPipeline-${branchName}`,
      crossAccountKeys: true,

      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("nielmclaren/CodeConveyor", branchName, {
          authentication: SecretValue.secretsManager("CodeConveyorGithubToken"),
        }),
        commands: [
          "cd infrastructure",
          "yarn install --frozen-lockfile",
          "yarn build",
          `npx cdk synth -c branchName=${branchName}`,
        ],
        primaryOutputDirectory: "infrastructure/cdk.out",
      }),
    });

    pipeline.addStage(
      new CodeConveyorStage(this, "Dev", new DevEnvironmentSettings(), {
        env: { account: REFLECT_DEV_ACCOUNT, region: "us-west-2" },
      })
    );

    if (branchName === "main") {
      pipeline.addStage(
        new CodeConveyorStage(this, "Staging", new StagingEnvironmentSettings(), {
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
}
