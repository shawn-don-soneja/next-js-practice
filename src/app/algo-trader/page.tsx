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
import EquityChart from './EquityChart';

import { authOptions } from "../api/auth/auth.config";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Button from 'react-bootstrap/Button';

function getProtocol() {
  return process.env.NODE_ENV === 'development' ? 'http' : 'https';
}

async function fetchRecords() {
  console.log('Fetching records from AWS...');
  const headersList = await headers();
  const host = headersList.get('host');
  console.log('host: ' + host);
  const protocol = getProtocol();
  const myURL = `${protocol}://${host}/api/fetchAwsData`;
  console.log('myURL: ' + myURL);
  const cookie = headersList.get('cookie');

  const res = await fetch(myURL, {
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
      cookie: cookie || '', // ✅ Fix
    },
  });

  if (!res.ok) {
    const errorText = await res.text(); // Attempt to get error details from the response
    throw new Error(`Failed to fetch records: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json();
}

type Order = { Id?: string; [key: string]: any };
type Log = { Id?: string; CreatedDate?: string; Status?: string; Description?: string; [key: string]: any };

const Page = async (props) => {
  let process_logs: Log[] = [];
  let orders: Order[] = [];
  try {
    let response = await fetchRecords();
    process_logs = response.logs || [];
    orders = response.orders || [];
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
      <Card>
        <h3 className="m-3">Automated Process Logs ({process_logs.length})</h3>
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Log Id</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {process_logs.length === 0 ? (
                <tr>
                  <td colSpan={5}>No records found</td>
                </tr>
              ) : (
                process_logs.map((record, i) => (
                  <tr key={record.Id || i}>
                    <td>{i + 1}</td>
                    <td>{record.Id || "N/A"}</td>
                    <td>{record.CreatedDate || "N/A"}</td>
                    <td>{record.Status || "N/A"}</td>
                    <td>{record.Description || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card>
      <br />
      <Card>
        <h3 className="m-3">Financial Data Orders ({orders.length})</h3>
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Id</th>
                <th>Record</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5}>No records found</td>
                </tr>
              ) : (
                orders.map((record, i) => (
                  <tr key={record.Id || i}>
                    <td>{i + 1}</td>
                    <td>{record.Id || "N/A"}</td>
                    <td>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                        {JSON.stringify(record, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card>
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
