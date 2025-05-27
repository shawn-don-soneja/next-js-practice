import { getToken } from "next-auth/jwt"; // ✅ changed
import { authOptions } from "../auth/auth.config";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({ region: process.env.AWS_DEFAULT_REGION });
const ddb = DynamoDBDocumentClient.from(ddbClient);

export async function GET(request) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET }); // ✅ changed

  console.log("Session:", session);

  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const data = await ddb.send(new ScanCommand({ TableName: "Automated_Process_Logs" }));
    return new Response(JSON.stringify(data.Items), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
