import { Construct, NestedStack } from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { LambdaIntegration, Method, RestApi } from '@aws-cdk/aws-apigateway';
import { EndpointStackProps } from '../../types/props';
import { HttpMethods } from '../../types/http';

export class HelloStack extends NestedStack {
  public readonly methods: Method[] = [];

  constructor(scope: Construct, props: EndpointStackProps) {
    super(scope, 'HelloStack', props);
    const api = RestApi.fromRestApiAttributes(this, 'AppRestApi', {
      restApiId: props.restApiId,
      rootResourceId: props.rootResourceId,
    });
    const usersLambda = new lambda.Function(this, 'HelloLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('functions/hello-lambda'),
      handler: 'index.default',
    });
    const usersIntegration = new LambdaIntegration(usersLambda);
    const method = api.root
      .addResource('hello')
      .addMethod(HttpMethods.GET, usersIntegration);
    this.methods.push(method);
  }
}
