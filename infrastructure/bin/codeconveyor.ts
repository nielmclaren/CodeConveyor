#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { PipelineStack } from "../lib/pipeline-stack";

const REFLECT_DEV_ACCOUNT = "510650182850";

const app = new cdk.App();
new PipelineStack(app, "PipelineStack", {
  env: { account: REFLECT_DEV_ACCOUNT, region: "us-west-2" },
});

app.synth();
