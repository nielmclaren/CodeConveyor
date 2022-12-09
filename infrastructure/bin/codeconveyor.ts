#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { REFLECT_CI_ACCOUNT } from "../lib/AwsAccounts";
import { PipelineStack } from "../lib/PipelineStack";

const app = new cdk.App();
const branchName = app.node.tryGetContext("branchName") || "main";

new PipelineStack(app, "PipelineStack", {
  env: { account: REFLECT_CI_ACCOUNT, region: "us-west-2" },
  stackName: `CodeConveyorPipelineStack-${branchName}`,
  branchName,
});

app.synth();
