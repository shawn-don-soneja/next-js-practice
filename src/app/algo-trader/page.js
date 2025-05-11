'use client';  // Client-side rendering

import React, { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import { Chart } from 'react-google-charts';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import styles from "../styles/charts.module.css";

const Page = (props) => {
  
  // This function fetches data from the server
  async function fetchData() {
    console.log('fetching');
  }

  // Fetch data on component load
  useEffect(() => {
    console.log('useEffecting')
    fetchData();
  }, []);

  // Display a loading message while fetching data
  return (
    <Container>
      <h2 className="m-2">Algo trading coming!</h2>
      <Card>
        Process Logs
        <Table></Table>
      </Card>
      <Card>Alpaca Portfolio Performance</Card>
    </Container>
  );
 
};

export default Page;
