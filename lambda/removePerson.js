const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand } = require("@aws-sdk/lib-dynamodb"); 

const client = new DynamoDBClient({ region: process.env.REGION });
const ddbClient = DynamoDBDocumentClient.from(client);


exports.handler = async function (event) {

    const id_value = event.queryStringParameters.id;

    try {
        let params = {
            TableName: process.env.DB_TABLE_NAME,
            Key: {
                id: id_value
            }
        }

        console.log('updated_params: ', params);

        const response = await ddbClient.send(new DeleteCommand(params))   

        return {
            statusCode: 200,
            body: "The user was deleted."
        }
    
    } catch (err) {
        console.log("Fell into catch block")
        console.log("Error", err);
        
        return {
            statusCode: 400,
            body: 'There was an error, not able to delete the user.'
        }
    }
}