# aws-cdk-lambda-dynamodb
Simple use of AWS CDK for HTTP API Gateway, Lambda, and DynamoDB.


## Notes
- HTTP API Gateway version used is `@aws-cdk/aws-apigatewayv2-alpha` [2.8.0](https://www.npmjs.com/package/@aws-cdk/aws-apigatewayv2-alpha) and the API may now have differences.
- This is mostly to play around with CDK, the logic in the lambda functions is not robust and doesn't handle errors well at all. 

## How to Use

1. Clone the repository

2. Install the dependencies

```
npm install && npm install --prefix layers/aws-sdk/nodejs
```

3. Create the CloudFormation stack using and deploy it using CDK

```
cdk deploy
```

4. Open CloudFormation in the AWS Console
