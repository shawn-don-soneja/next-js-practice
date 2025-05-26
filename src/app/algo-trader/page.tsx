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

function getProtocol() {
  return process.env.NODE_ENV === 'development' ? 'http' : 'https';
}

async function fetchRecords() {
  const res = await fetch('/api/fetchAwsData', { 
    next: { revalidate: 0 },
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch records');
  return res.json();
}


const Page = async (props) => {
  let records = [];
  try {
    records = await fetchRecords();
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
        <h3>Automated Process Logs</h3>
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
            {records.length === 0 ? (
              <tr>
                <td colSpan={5}>No records found</td>
              </tr>
            ) : (
              records.map((record, i) => (
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
      </Card>
      <br/>
      <Card>Alpaca Portfolio Performance</Card>
    </Container>
  );
 
};

export default async function MyPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  //const data = await getMyData(); // Secure server-only call
  
  return (
    <div>
        <pre>Successfully Authenticated: {session.user?.name}</pre>
      <Page/>
    </div>
  );
}
