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
    const data2 = await ddb.send(new ScanCommand({ TableName: "Financial_Data_Orders" }));

    console.log("Data fetched from DynamoDB:", data);

    // Sort both datasets by CreatedDate descending (newest first)
    const sortedLogs = data.Items && data.Items.length
      ? data.Items.sort((a, b) =>
        new Date(b.CreatedDate || b.CreatedDate) - new Date(a.CreatedDate || a.CreatedDate)
      )
      : [];

    const sortedOrders = data2.Items && data2.Items.length
      ? data2.Items.sort((a, b) =>
        new Date(b.CreatedDate || b.CreatedDate) - new Date(a.CreatedDate || a.CreatedDate)
      )
      : [];

    // Combine both datasets in the response
    return new Response(
        JSON.stringify({
        logs: sortedLogs,
        orders: sortedOrders,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
