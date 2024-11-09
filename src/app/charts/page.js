'use client';  // Client-side rendering

import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Chart } from 'react-google-charts';
import CardInfo from './CardInfo';

const options = {
  title: "Company Performance",
  curveType: "function",
  legend: { position: "bottom" },
  colors: ["#2596be", "#094e89"],
};

const Page = (props) => {
  // State to store chart data
  const [chartData, setChartData] = useState([
    ["Year", "GDP"],
    ["2004", 1000],
    ["2005", 1170],
    ["2006", 660],
    ["2007", 1030],
  ]);
  
  const [loading, setLoading] = useState(true);

  // This function fetches data from the server
  async function fetchData() {
    console.log('fetching');
    try {
      const response = await fetch(`https://get.geojs.io/v1/ip/country.json?ip=8.8.8.8`, {
        cache: 'no-store',  // Ensures fresh data on each request
      });
  
      // Check if the response is OK
      if (!response.ok) {
        console.error(`Error: Received status ${response.status}`);
        return []; // Exit early if the response isn't successful
      }
  
      console.log('Response received:', response);
  
      // Try to parse the response as JSON
      const data = await response.json();
      console.log('Data received:', data);
  
      return data;
  
    } catch (error) {
      console.error("Failed to fetch data:", error);
      return []; // Fallback if API call fails
    }
  }

  // Fetch data on component load
  useEffect(() => {
    console.log('useEffecting')
    fetchData();
  }, []);

  // Display a loading message while fetching data
  if (loading) {
    return <div>Loading data...</div>;
  }

  // Render chart after data is loaded
  return (
    <Container>
      <Row>
        <Col>
          <h1 className="mt-4 m-3">Financial Dashboard</h1>
          <h5 className="mt-2 m-3 text-muted">
            Here, we’re tracking four key macroeconomic indicators: <b>Interest Rates, Unemployment, Inflation, and GDP</b>
          </h5>
        </Col>
      </Row>
      <Row>
        <Col className="m-3" lg={true}>
          <Card>
            <Chart
              chartType="LineChart"
              width="100%"
              height="400px"
              data={chartData}  // Using the fetched chart data
              options={options}
            />
            <CardInfo />
          </Card>
        </Col>
        <Col className="m-3" sm={true}>
          <Card>
            <Chart
              chartType="LineChart"
              width="100%"
              height="400px"
              data={chartData}  // Using the fetched chart data
              options={options}
            />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col className="m-3">
          <Card>
            <Chart
              chartType="LineChart"
              width="100%"
              height="400px"
              data={chartData}  // Using the fetched chart data
              options={options}
            />
            <CardInfo />
          </Card>
        </Col>
        <Col className="m-3">
          <Card>
            <Chart
              chartType="LineChart"
              width="100%"
              height="400px"
              data={chartData}  // Using the fetched chart data
              options={options}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
