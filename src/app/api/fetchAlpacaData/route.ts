import { getToken } from "next-auth/jwt";

export async function GET(request) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const alpacaBaseUrl = process.env.ALPACA_BASE_URL;
  const alpacaSecret = process.env.ALPACA_SECRET_KEY;
  const portfolioHistoryUrl = process.env.ALPACA_BASE_URL;

  console.log("Session:", session);

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
    if (!alpacaBaseUrl || !alpacaSecret) {
      return new Response(JSON.stringify({ error: "Missing Alpaca credentials" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const headers = {
      "APCA-API-KEY-ID": alpacaBaseUrl,
      "APCA-API-SECRET-KEY": alpacaSecret,
      Authorization: `Bearer ${token}`,
    };

    const [portfolioResponse] = await Promise.all([
      fetch(`${portfolioHistoryUrl}/v2/account/portfolio/history?period=1M&timeframe=1D`, {
      headers,
      })
    ]);

    const portfolioHistory = await portfolioResponse.json();


    // Combine both datasets in the response
    return new Response(
        JSON.stringify({
        data: portfolioHistory,
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
