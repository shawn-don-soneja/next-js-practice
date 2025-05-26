import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth.config"; // Adjust path if needed

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({ region: process.env.AWS_DEFAULT_REGION });
const ddb = DynamoDBDocumentClient.from(ddbClient);

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

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
