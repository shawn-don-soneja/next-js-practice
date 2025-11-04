// src/app/page.js

async function fetchData() {
  const apiUrl = process.env.SF_AUTH_URL;
  const dataUrl = process.env.SF_DATA_URL;

  // Make a secure call to the external API using the URL and API key from the environment
  const auth = await fetch(apiUrl);
  const authData = await auth.json();

  console.log('auth call data: ' + authData.access_token);
  console.log('auth call: ' + auth.status);

  // Handle response errors
  if (!auth.ok) {
    // Log error details if the response is not successful
    console.error('Error: API call failed');
    console.error('Status:', res.status);
    console.error('Status Text:', res.statusText);

    // You can also log the response body if you need to inspect it (useful for debugging)
    const errorData = await res.json();
    console.error('Error Data:', errorData);

    throw new Error(`API call failed with status ${res.status}`);
  }
  
  // Make a secure call to the external API using the URL and API key from the environment
  const res = await fetch(dataUrl, {
    headers: {
      Authorization: `Bearer ${authData.access_token}`,
    },
  })

  // Handle response errors
  if (!res.ok) {
    // Log error details if the response is not successful
    console.error('Error: API call failed');
    console.error('Status:', res.status);
    console.error('Status Text:', res.statusText);

    // You can also log the response body if you need to inspect it (useful for debugging)
    const errorData = await res.json();
    console.error('Error Data:', errorData);

    throw new Error(`API call failed with status ${res.status}`);
  }

  const data = await res.json();
  return data;
}

export default async function HomePage() {
  const data = await fetchData();

  return (
    <div>
      <h1>Secure Data Fetching with URL from Environment</h1>
      <p>Data from server-side API call:</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
