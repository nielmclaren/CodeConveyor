import { CfnOutput, Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CodeConveyorStack } from "./CodeConveyorStack";
import { IEnvironmentSettings } from "./EnvironmentSettings";

export class CodeConveyorStage extends Stage {
  public readonly urlOutput: CfnOutput;

  constructor(scope: Construct, id: string, envSettings: IEnvironmentSettings, props: StageProps) {
    super(scope, id, props);
    const service = new CodeConveyorStack(this, "CodeConveyor", envSettings, props);

    this.urlOutput = service.urlOutput;
  }
}
