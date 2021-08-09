import { NestedStackProps } from '@aws-cdk/core';
import { Method } from '@aws-cdk/aws-apigateway';

export interface EndpointStackProps extends NestedStackProps {
  readonly restApiId: string;
  readonly rootResourceId: string;
}

export interface DeployStackProps extends NestedStackProps {
  readonly restApiId: string;
  readonly methods?: Method[];
}
