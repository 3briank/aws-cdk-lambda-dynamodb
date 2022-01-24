import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';


export class PersonAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const REGION = "us-east-1"; //e.g. "us-east-1"

    // Dynamo DB:

    const table = new dynamodb.Table(this, 'Table', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1, 
      writeCapacity: 1, 
      removalPolicy: RemovalPolicy.DESTROY
    });

    // Lambda Layer:

    const awsSDKLayer = new lambda.LayerVersion(this, 'aws-sdk-layer', {
      compatibleRuntimes: [lambda.Runtime.NODEJS_14_X],
      code: lambda.Code.fromAsset('layers/aws-sdk'),
      description: 'AWS SDK with client, util, and lib dynamodb'
    });


    // Lambda Functions:

    const createPersonFunct = new lambda.Function(this, 'createPersonFunct', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'createPerson.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: { DB_TABLE_NAME: table.tableName, REGION: REGION },
      layers: [awsSDKLayer]
    });

    const removePersonFunct = new lambda.Function(this, 'removePersonFunct', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'removePerson.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: { DB_TABLE_NAME: table.tableName, REGION: REGION },
      layers: [awsSDKLayer]
    });

    const getInfoFunct = new lambda.Function(this, 'getInfoFunct', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'getInfo.handler',
      code: lambda.Code.fromAsset('lambda'), 
      environment: { DB_TABLE_NAME: table.tableName, REGION: REGION },
      layers: [awsSDKLayer]
    });

    const updateNoteFunct = new lambda.Function(this, 'updateNoteFunct', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'updateNote.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: { DB_TABLE_NAME: table.tableName, REGION: REGION },
      layers: [awsSDKLayer]
    });

    table.grantReadData(getInfoFunct)
    table.grantWriteData(getInfoFunct)
    
    table.grantWriteData(updateNoteFunct)

    table.grantWriteData(removePersonFunct);

    // API Gateway:

    const personHttpApi = new HttpApi(this, "personHttpApi");

    personHttpApi.addRoutes({
      path: '/person',
      methods: [HttpMethod.GET, HttpMethod.DELETE],
      integration: new HttpLambdaIntegration('create-person', createPersonFunct)
    });

    personHttpApi.addRoutes({
      path: '/getInfo',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration('get-info', getInfoFunct)
    });

    personHttpApi.addRoutes({
      path: '/updateNote',
      methods: [HttpMethod.PUT],
      integration: new HttpLambdaIntegration('update-note', updateNoteFunct)
    });





  }
}
