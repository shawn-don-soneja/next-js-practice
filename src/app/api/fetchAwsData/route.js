// pages/api/records.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const ddb = DynamoDBDocumentClient.from(ddbClient);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const data = await ddb.send(new ScanCommand({ TableName: "YourTableName" }));
    res.status(200).json(data.Items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}