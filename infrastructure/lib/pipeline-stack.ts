import * as cdk from "aws-cdk-lib";
import { SecretValue } from "aws-cdk-lib";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { REFLECT_DEV_ACCOUNT } from "./aws-accounts";
import { CodeConveyorStage } from "./codeconveyor-stage";

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "CodeConveyorPipeline",

      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("nielmclaren/CodeConveyor", "main", {
          authentication: SecretValue.secretsManager("GithubToken"),
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
      new CodeConveyorStage(this, "Dev", {
        env: { account: REFLECT_DEV_ACCOUNT, region: "us-west-2" },
      })
    );
  }
}
