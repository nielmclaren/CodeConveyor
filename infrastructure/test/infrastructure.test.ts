import * as cdk from "aws-cdk-lib";
import { Template, Match } from "aws-cdk-lib/assertions";
import * as CodeConveyor from "../lib/CodeConveyorStack";
import { DevEnvironmentSettings } from "../lib/EnvironmentSettings";

test("SQS Queue and SNS Topic Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new CodeConveyor.CodeConveyorStack(app, "MyTestStack", new DevEnvironmentSettings(), {});
  // THEN

  // TODO When does this test actually get run?
  const template = Template.fromStack(stack);

  template.hasResourceProperties("AWS::SQS::Queue", {
    VisibilityTimeout: 300,
  });
  template.resourceCountIs("AWS::SNS::Topic", 1);
});
