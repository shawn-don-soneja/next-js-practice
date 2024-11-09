// app/api/fetchData/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://cat-fact.herokuapp.com/facts/');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
