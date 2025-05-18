import React from 'react';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import { Chart } from 'react-google-charts';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import styles from "../styles/charts.module.css";

import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";



const Page = (props) => {
  
  // This function fetches data from the server
  async function fetchData() {
    console.log('fetching');
  }

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
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
          <td>ssa</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
          <td>ssa</td>
        </tr>
        <tr>
          <td>3</td>
          <td colSpan={2}>Larry the Bird</td>
          <td>@twitter</td>
          <td>ssa</td>
        </tr>
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
