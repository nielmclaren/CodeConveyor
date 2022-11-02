#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { REFLECT_DEV_ACCOUNT } from "../lib/aws-accounts";
import { PipelineStack } from "../lib/pipeline-stack";

const app = new cdk.App();
new PipelineStack(app, "PipelineStack", {
  env: { account: REFLECT_DEV_ACCOUNT, region: "us-west-2" },
});

app.synth();
