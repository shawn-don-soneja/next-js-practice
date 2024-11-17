'use client';  // Client-side rendering

import React, { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Chart } from 'react-google-charts';
import CardInfo from './CardInfo';

const gdp_chart_config = {
  title: "GDP",
  curveType: "function",
  legend: { position: "bottom" },
  colors: ["#7ACCC8", "#094e89"],
};

const interest_rate_chart_config = {
  title: "Interest Rates",
  curveType: "function",
  legend: { position: "bottom" },
  colors: ["#2596be", "#094e89"],
};

const unemployment_chart_config = {
  title: "Unemployment",
  curveType: "function",
  legend: { position: "bottom" },
  colors: ["#2596be", "#094e89"],
};

const cpi_chart_config = {
  title: "CPI (Inflation)",
  curveType: "function",
  legend: { position: "bottom" },
  colors: ["#2596be", "#094e89"],
};

const Page = (props) => {
  // State to store chart data

  //1. GDP
  const [gdpData, setGdpData] = useState([
    ["Year", "GDP"],
    ["2004", 1000],
    ["2005", 1170],
    ["2006", 660],
    ["2007", 1030],
  ]);
  const [unemploymentData, setUnemploymentData] = useState([
    ["Year", "GDP"],
    ["2004", 1000],
    ["2005", 1170],
    ["2006", 660],
    ["2007", 1030],
  ]);
  const [interestRateData, setInterestRateData] = useState([
    ["Year", "GDP"],
    ["2004", 1000],
    ["2005", 1170],
    ["2006", 660],
    ["2007", 1030],
  ]);
  const [cpiData, setCpiData] = useState([
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
      const response = await fetch(`/api/fetchSalesforceData`, {
        cache: 'no-store',  // Ensures fresh data on each request
      });
  
      // Check if the response is OK
      if (!response.ok) {
        console.error(`Error: Received status ${response.status}`);
        return []; // Exit early if the response isn't successful
      }
      const data = await response.json();
      setGdpData(data.gdp);
      setInterestRateData(data.interest_rates);
      setUnemploymentData(data.unemployment_data);
      setCpiData(data.cpi);
      setLoading(false);
  
      console.log('Response received:', JSON.stringify(data));
  
      // Try to parse the response as JSON
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
            Here, we’re tracking four key macroeconomic indicators: <b>GDP, Unemployment, Interest Rates, and Inflation</b>
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
              data={gdpData}  // Using the fetched chart data
              options={gdp_chart_config}
            />
            <h5 className='m-3'>Trend: <Badge bg="secondary">Increasing</Badge></h5>
            <CardInfo />
          </Card>
        </Col>
        <Col className="m-3" sm={true}>
          <Card>
            <Chart
              chartType="LineChart"
              width="100%"
              height="400px"
              data={unemploymentData}  // Using the fetched chart data
              options={unemployment_chart_config}
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
              data={interestRateData}  // Using the fetched chart data
              options={interest_rate_chart_config}
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
              data={cpiData}  // Using the fetched chart data
              options={cpi_chart_config}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
