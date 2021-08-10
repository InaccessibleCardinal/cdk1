import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { RestApi } from '@aws-cdk/aws-apigateway';
import { UsersStack } from './stacks/UsersStack';
import { HttpMethods } from '../types/http';
import { HelloStack } from './stacks/HelloStack';
import { DeployStack } from './stacks/DeployStack';

export class AppApi extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new RestApi(this, 'AppRestApi', {
      deploy: false,
    });
    api.root.addMethod(HttpMethods.ANY);
    const propsToPass = {
      restApiId: api.restApiId,
      rootResourceId: api.restApiRootResourceId,
    };
    const usersStack = new UsersStack(this, propsToPass);
    const helloStack = new HelloStack(this, propsToPass);
    new DeployStack(this, {
      restApiId: api.restApiId,
      methods: [...usersStack.methods, ...helloStack.methods],
    });
  }
}
