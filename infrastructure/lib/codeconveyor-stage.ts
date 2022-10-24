import { CfnOutput, Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CodeConveyorStack } from "./codeconveyor-stack";

export class CodeConveyorStage extends Stage {
  public readonly urlOutput: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    const service = new CodeConveyorStack(this, "API");

    this.urlOutput = service.urlOutput;
  }
}
