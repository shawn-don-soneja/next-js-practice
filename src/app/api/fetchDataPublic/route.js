// app/api/fetchData/route.js
import { NextResponse } from 'next/server';

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
