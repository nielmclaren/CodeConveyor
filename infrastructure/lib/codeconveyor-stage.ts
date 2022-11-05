import { CfnOutput, Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CodeConveyorStack } from "./codeconveyor-stack";
import { IEnvironmentSettings } from "./environment-settings";

export class CodeConveyorStage extends Stage {
  public readonly urlOutput: CfnOutput;

  constructor(
    scope: Construct,
    id: string,
    envSettings: IEnvironmentSettings,
    props?: StageProps
  ) {
    super(scope, id, props);
    const service = new CodeConveyorStack(this, "CodeConveyorApi", envSettings);

    this.urlOutput = service.urlOutput;
  }
}
