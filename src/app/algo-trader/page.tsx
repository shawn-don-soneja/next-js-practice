import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import { Chart } from 'react-google-charts';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import styles from "../styles/charts.module.css";
import { headers } from 'next/headers';
import EquityChartNoSSR from './EquityChartNoSSR';
import ClientTablesNoSSR from './ClientTablesNoSSR';

import { authOptions } from "../api/auth/auth.config";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Button from 'react-bootstrap/Button';
import StrategySelection from './StrategySelectionNoSSR';

function getProtocol() {
  return process.env.NODE_ENV === 'development' ? 'http' : 'https';
}

async function fetchAwsRecords() {
  console.log('Fetching records from AWS...');
  const headersList = await headers();
  const host = headersList.get('host');
  console.log('host: '+ host);
  const protocol = getProtocol();
  const myAwsURL = `${protocol}://${host}/api/fetchAwsData`;
  
  console.log('myAwsURL: ' + myAwsURL);
  const cookie = headersList.get('cookie');


  // Retrieve AWS data (Automated_Process_Logs and Financial_Data_Orders)
  const res_aws = await fetch(myAwsURL, {
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
      cookie: cookie || '', // ✅ Fix
    },
  });

  if (!res_aws.ok) {
    const errorText = await res_aws.text(); // Attempt to get error details from the response
    throw new Error(`Failed to fetch records: ${res_aws.status} ${res_aws.statusText} - ${errorText}`);
  }
  return res_aws.json();
}

async function fetchAlpacaRecords() {
  const headersList = await headers();
  const host = headersList.get('host');
  console.log('host: ' + host);
  const protocol = getProtocol();
  const myAlpacaURL = `${protocol}://${host}/api/fetchAlpacaData`;
  const cookie = headersList.get('cookie');
  const res_alpaca = await fetch(myAlpacaURL, {
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
      cookie: cookie || '', // ✅ Fix
    },
  });
  if (!res_alpaca.ok) {
    const errorText = await res_alpaca.text(); // Attempt to get error details from the response
    throw new Error(`Failed to fetch records: ${res_alpaca.status} ${res_alpaca.statusText} - ${errorText}`);
  }
  return res_alpaca.json();
}

type Order = { Id?: string; [key: string]: any };
type Log = { Id?: string; CreatedDate?: string; Status?: string; Description?: string; [key: string]: any };
type PortfolioHistory = {
  timestamp?: number[];
  equity?: number[];
  profit_loss?: number[];
  profit_loss_pct?: number[];
  base_value?: number;
  base_value_asof?: string;
  timeframe?: string;
};

const Page = async (props) => {
  let process_logs: Log[] = [];
  let orders: Order[] = [];
  let portfolioHistory: PortfolioHistory[] = [];
  try {
    let awsResponse = await fetchAwsRecords();
    process_logs = awsResponse.logs || [];
    orders = awsResponse.orders || [];

    let alpacaResponse = await fetchAlpacaRecords();
    portfolioHistory = alpacaResponse.data || [];
  } catch (error) {
    console.error('Error fetching records:', error);
    return (
      <Container>
        <Card>
          <h3>Error Loading Data</h3>
          <p>Failed to fetch records. Please try again later.</p>
          <pre>{error.message}</pre>
        </Card>
        {/* <EquityChart/> */}
      </Container>
    );
  }

  // Display the data when successfully loaded
  return (
    <Container>
      <StrategySelection/>
      <ClientTablesNoSSR processLogs={process_logs} orders={orders} />
      <br />
      <EquityChartNoSSR input={portfolioHistory}/>
      <br />
      {/* New Orders Chart Card */}
      <Card>
        <h3 className="m-3">Alpaca Orders Chart (0)</h3>
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {/* TODO: Replace with actual chart or data for orders */}
          <pre style={{ margin: 0, color: '#888' }}>Orders chart coming soon...</pre>
        </div>
      </Card>
      <br />
      {/* New Positions Card */}
      <Card>
        <h3 className="m-3">Alpaca Positions (0)</h3>
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {/* TODO: Replace with actual chart or data for positions */}
          <pre style={{ margin: 0, color: '#888' }}>Positions chart coming soon...</pre>
        </div>
      </Card>
      <br />
      <Card>
        <a href='https://app.alpaca.markets/account/login' target="_blank" rel="noopener noreferrer">
          <Button>Alpaca Login</Button>
        </a>
      </Card>
      <br />
      <br />
      {/* <Card>Alpaca Portfolio Performance</Card> */}
    </Container>
  );
};

export default async function MyPage() {
  const session = await getServerSession(authOptions); // ✅ This works in App Router
  if (!session) redirect("/algo-trader-login");

  return (
    <div>
      <pre>Successfully Authenticated: {session.user?.name}</pre>
      <Page />
    </div>
  );
}
