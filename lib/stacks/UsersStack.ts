import { Construct, NestedStack } from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import {
  LambdaIntegration,
  Method,
  RestApi,
  TokenAuthorizer,
} from '@aws-cdk/aws-apigateway';
import { EndpointStackProps } from '../../types/props';
import { HttpMethods } from '../../types/http';

export class UsersStack extends NestedStack {
  public readonly methods: Method[] = [];

  constructor(scope: Construct, props: EndpointStackProps) {
    super(scope, 'UsersStack', props);
    const api = RestApi.fromRestApiAttributes(this, 'AppRestApi', {
      restApiId: props.restApiId,
      rootResourceId: props.rootResourceId,
    });
    const authLambda = new lambda.Function(this, 'authorizerLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('functions/__dist__/authorizerLambda'),
      handler: 'index.default',
    });
    const authorizer = new TokenAuthorizer(this, 'Authorizer', {
      handler: authLambda,
    });
    const usersLambda = new lambda.Function(this, 'UsersLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('functions/__dist__/usersLambda'),
      handler: 'index.default',
    });
    const usersIntegration = new LambdaIntegration(usersLambda);
    const method = api.root
      .addResource('users')
      .addMethod(HttpMethods.GET, usersIntegration, {
        authorizer,
      });
    this.methods.push(method);
  }
}
