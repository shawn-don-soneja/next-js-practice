import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({ region: process.env.AWS_DEFAULT_REGION });
const ddb = DynamoDBDocumentClient.from(ddbClient);

export async function GET() {
  try {
    const data = await ddb.send(new ScanCommand({ TableName: "Automated_Process_Logs" }));
    console.log(data);
    return new Response(JSON.stringify(data.Items), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
