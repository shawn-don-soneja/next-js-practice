// app/api/fetchData/route.js
import { NextResponse } from 'next/server';

//this file is just for a public api, to make sure i have connectivity from my server to my client, for testing

export async function GET() {
    console.log('API route: Received request'); // Start of API route
    try {
        const response = await fetch('https://get.geojs.io/v1/ip/country.json?ip=8.8.8.8');
        const data = await response.json();
        console.log('server: ' + data);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
