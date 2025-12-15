import { getToken } from "next-auth/jwt";
import { formatForGoogleLineChart } from "../../../lib";

export async function GET(request) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const baseURL = process.env.ALPHA_VANTAGE_URL;
  const client = process.env.ALPHA_VANTAGE_KEY;

  //console.log("Session:", session);

  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Request for Alpaca Data
      // 1. Portfolio Value overtime - v2/account/portfolio/history?period=1M&timeframe=1D

    const token = session.accessToken;    

    // ensure env/values are present
    if (!baseURL || !client) {
      return new Response(JSON.stringify({ error: "Missing Alpaca credentials" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const requestUrl = `${baseURL}${client}`;
    console.log(requestUrl);
    const [response] = await Promise.all([
      fetch(requestUrl)
    ]);

    const spy_data = await response.json();

    const formatted_spy_data = await formatForGoogleLineChart(spy_data["Time Series (Daily)"]);

    console.log(spy_data, formatted_spy_data);

    // Combine both datasets in the response
    return new Response(
      JSON.stringify({
        data: formatted_spy_data,
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
