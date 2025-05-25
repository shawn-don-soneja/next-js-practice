import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import { Chart } from 'react-google-charts';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import styles from "../styles/charts.module.css";

import { authOptions } from "../api/auth/auth.config";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";


async function fetchRecords() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/fetchAwsData`, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error("Failed to fetch records");
  return res.json();
}

const Page = async (props) => {
  
  const records = await fetchRecords();

  // Display a loading message while fetching data
  return (
    <Container>
      <h2 className="m-2">Algo trading coming!</h2>
      <Card>
        Process Logs
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
