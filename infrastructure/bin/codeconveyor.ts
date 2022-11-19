#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { REFLECT_CI_ACCOUNT } from "../lib/AwsAccounts";
import { PipelineStack } from "../lib/PipelineStack";

const app = new cdk.App();
new PipelineStack(app, "PipelineStack", {
  env: { account: REFLECT_CI_ACCOUNT, region: "us-west-2" },
});

app.synth();
