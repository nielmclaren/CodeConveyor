import { StackProps } from "aws-cdk-lib";

export interface PipelineStackProps extends StackProps {
  branchName: string;
}
