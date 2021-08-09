import { Deployment, RestApi, Stage } from '@aws-cdk/aws-apigateway';
import { NestedStack, Construct } from '@aws-cdk/core';
import { DeployStackProps } from '../../types/props';

export class DeployStack extends NestedStack {
  constructor(scope: Construct, props: DeployStackProps) {
    super(scope, 'AppApi-DeployStack', props);

    const deployment = new Deployment(this, 'AppApi-Deployment', {
      api: RestApi.fromRestApiId(this, 'RestApi', props.restApiId),
    });
    (props.methods ?? []).forEach((method) =>
      deployment.node.addDependency(method)
    );
    new Stage(this, 'dev', { deployment });
  }
}
