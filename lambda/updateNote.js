const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb"); 

const client = new DynamoDBClient({ region: process.env.REGION });
const ddbClient = DynamoDBDocumentClient.from(client);


exports.handler = async function (event) {

    const id_value = event.queryStringParameters.id;
    const note = event.queryStringParameters.note;

    try {
        let update_params = {
            TableName: process.env.DB_TABLE_NAME,
            Key: {
                id: id_value
            },
            UpdateExpression: 'SET note = :n, numReads = :r',
            ExpressionAttributeValues: {":n": note, ":r": 0}
        }

        console.log('updated_params: ', update_params);

        const response = await ddbClient.send(new UpdateCommand(update_params))   

        return {
            statusCode: 200,
            body: "The note was updated."
        }
    
    } catch (err) {
        console.log("Fell into catch block")
        console.log("Error", err);
        
        return {
            statusCode: 400,
            body: 'There was an error, not able to update the note.'
        }
    }
}