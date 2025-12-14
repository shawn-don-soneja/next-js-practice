import { getToken } from "next-auth/jwt";

export async function GET(request) {
  const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const alpacaBaseUrl = process.env.ALPACA_BASE_URL;
  const alpacaClient = process.env.ALPACA_CLIENT_KEY;
  const alpacaSecret = process.env.ALPACA_SECRET_KEY;
  const portfolioHistoryEndpoint = process.env.ALPACA_PORTFOLIO_HISTORY_ENDPOINT;

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
    if (!alpacaBaseUrl || !alpacaClient || !alpacaSecret ) {
      return new Response(JSON.stringify({ error: "Missing Alpaca credentials" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const headers = {
      "APCA-API-KEY-ID": alpacaClient,
      "APCA-API-SECRET-KEY": alpacaSecret,
    };

    const requestUrl = `${alpacaBaseUrl}${portfolioHistoryEndpoint}`;
    const [portfolioResponse] = await Promise.all([
      fetch(requestUrl, {
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
