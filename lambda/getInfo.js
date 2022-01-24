const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb"); 

const client = new DynamoDBClient({ region: process.env.REGION });
const ddbClient = DynamoDBDocumentClient.from(client);


exports.handler = async function (event) {

    const id_value = event.queryStringParameters.id;

    let params = {
        TableName: process.env.DB_TABLE_NAME,
        Key: {
            id: id_value
        }
    }

    console.log("params are: ", params)

    try {
        let data = await ddbClient.send(new GetCommand(params));
        console.log(data)
        
        let message = JSON.stringify(data.Item);
        
        console.log('data.Item.numReads is: ', data.Item.numReads);

        let newNumReads = data.Item.numReads + 1;

        console.log('newNumReads is: ', newNumReads);

        let update_params = {
            TableName: process.env.DB_TABLE_NAME,
            Key: {
                id: id_value
            },
            UpdateExpression: 'SET numReads = :r',
            ExpressionAttributeValues: {":r": newNumReads}
        }

        console.log('updated_params: ', update_params);

        const response = await ddbClient.send(new UpdateCommand(update_params))   


        return {
            statusCode: 200,
            body: message
        }
    
    } catch (err) {
        console.log("Fell into catch block")
        console.log("Error", err);
        
        return {
            statusCode: 400,
            body: 'There was an error'
        }
    }


}