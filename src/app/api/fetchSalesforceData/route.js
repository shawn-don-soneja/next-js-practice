// app/api/fetchData/route.js
import { NextResponse } from 'next/server';

export async function GET() {
    console.log('API route: Received request'); // Start of API route
    try {
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

        const resData = await res.json();

        const formattedData = [["Date", "GDP_Server"]];

        console.log(resData.records.length);

        for(const record of resData.records){
            formattedData.push([record.Date__c, record.Value__c]);
        }

        return NextResponse.json(formattedData);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
