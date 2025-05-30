'use client';  // Client-side rendering

import React, { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Chart } from 'react-google-charts';
import CardInfo from './CardInfo';
import styles from "../styles/charts.module.css";

const gdp_chart_config = {
  //title: "GDP ($T)",
  curveType: "function",
  legend: { position: "bottom" },
  colors: ["#ff8c00", "#094e89"],
};

const interest_rate_chart_config = {
  //title: "Interest Rates (%)",
  curveType: "function",
  legend: { position: "bottom" },
  colors: ["#ff8c00", "#094e89"],
};

const unemployment_chart_config = {
  //title: "Unemployment (#)",
  curveType: "function",
  legend: { position: "bottom" },
  colors: ["#ff8c00", "#094e89"],
};

const cpi_chart_config = {
  //title: "Inflation ($)",
  curveType: "function",
  legend: { position: "bottom" },
  colors: ["#ff8c00", "#094e89"],
};

const Page = (props) => {
  //loading state
  const [loading, setLoading] = useState(true);

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
  
  // State to store trend data
  const [gdpTrend, setGdpTrend] = useState();
  const [unemploymentTrend, setUnemploymentTrend] = useState();
  const [interestRateTrend, setInterestRateTrend] = useState();
  const [cpiTrend, setCpiTrend] = useState();

  // This function fetches data from the server
  async function fetchData() {
    console.log('fetching');
    try {
      const response = await fetch(`/api/fetchSalesforceData`, {
        //cache: 'no-store',  // Ensures fresh data on each request if enabled
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
      setGdpTrend(data.gdpTrend);
      setUnemploymentTrend(data.unemploymentTrend);
      setCpiTrend(data.cpiTrend);
      setInterestRateTrend(data.interestRateTrend);
      setLoading(false);
  
      //console.log('Response received:', JSON.stringify(data));
  
      // Try to parse the response as JSON
      //console.log('Data received:', data);
  
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
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'sans-serif',
        color: '#555'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #ccc',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }} />
        <div>Loading data...</div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Render chart after data is loaded
  return (
    <Container className='macro-economic-dashboard'>
      <Row>
        <Col>
          <h1 className="mt-5 m-3">United States, Macroeconomic Snapshot</h1>
          <h5 className={styles.headerSpaced}>
            Here we’re tracking <b>four key indicators</b>, for the United States Macroeconomy:
            <ol>
              <li><b>GDP</b></li>
              <li><b>Unemployment</b></li>
              <li><b>Interest Rates</b></li>
              <li><b>Inflation</b></li>  
            </ol>
            This project is a part of <a href='https://shawnsoneja.com' target='_blank'>shawnsoneja.com</a>. You can read more about it <a href='https://humorous-drink-54e.notion.site/Macro-Predictor-Project-Writeup-139b0558046180779d5dfa8641ed15f5' target='_blank'>here</a>.
          </h5>
          <br/>
        </Col>
      </Row>
      <Row>
        <Col className="mb-4 d-inline-block justify-content-center" lg={true}>
          <Card className={styles.card}>
            <h3 className={styles.header}>1. GDP ($T)</h3>
            <Chart
              chartType="LineChart"
              className={styles.chartStyle}
              data={gdpData}  // Using the fetched chart data
              options={gdp_chart_config}
            />
            <h5 className='m-3'>Trend: <Badge bg="secondary">{gdpTrend > 0 ? "Increasing" : "Decreasing"} (${Number(gdpTrend.toFixed(2))}B/quarter)</Badge></h5>
            <CardInfo />
          </Card>
        </Col>
        <Col className="mb-4 d-inline-block justify-content-center" sm={true}>
          <Card className={styles.card}>
            <h3 className={styles.header}>2. Unemployment (#)</h3>
            <Chart
              chartType="LineChart"
              className={styles.chartStyle}
              data={unemploymentData}  // Using the fetched chart data
              options={unemployment_chart_config}
            />
            <h5 className='m-3'>Trend: <Badge bg="secondary">{unemploymentTrend > 0 ? "Increasing" : "Decreasing"} ({Number(unemploymentTrend.toFixed(2))} employed persons/month)</Badge></h5>
            <CardInfo dataType="Unemployment"/>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col className="mb-4 d-inline-block justify-content-center">
          <Card className={styles.card}>
          <h3 className={styles.header}>3. Interest Rates (%)</h3>
            <Chart
              chartType="LineChart"
              className={styles.chartStyle}
              data={interestRateData}  // Using the fetched chart data
              options={interest_rate_chart_config}
            />
            <h5 className='m-3'>Trend: <Badge bg="secondary">{interestRateTrend > 0 ? "Increasing" : "Decreasing"} ({Number(interestRateTrend.toFixed(2))}%/month)</Badge></h5>
            <CardInfo dataType="Interest Rate"/>
          </Card>
        </Col>
        <Col className="mb-4 d-inline-block justify-content-center">
          <Card className={styles.card}>
            <h3 className={styles.header}>4. Inflation ($)</h3>
            <Chart
              chartType="LineChart"
              className={styles.chartStyle}
              data={cpiData}  // Using the fetched chart data
              options={cpi_chart_config}
            />
            <h5 className='m-3'>Trend: <Badge bg="secondary">{cpiTrend > 0 ? "Increasing" : "Decreasing"} (${Number(cpiTrend.toFixed(2))}/month)</Badge></h5>
            <CardInfo dataType="CPI"/>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col className="mb-4 d-inline-block justify-content-center mb-3">
          <Card className={styles.card}>
            <h5 className="m-3">Useful Links</h5>
            <ul>
              <li><b>Understanding BLS API</b></li>
              
              <ul>
                <li>General</li>
                <ul>
                  <li><a href="https://www.bls.gov/developers/api_FAQs.htm" target='_blank'>API FAQ</a></li>
                </ul>
              </ul>
              <ul>
                <li>Unemployment</li>
                <ul>
                  <li><a href='https://www.bls.gov/bls/unemployment.htm' target='_blank'>Unemployment</a></li>
                  <li><a href="https://www.bls.gov/help/hlpforma.htm#CE" target='_blank'>Timeseries Code Naming Convention (CE = Employment)</a></li>
                  <li><a href="https://download.bls.gov/pub/time.series/la/la.area_type" target='_blank'>Types of Areas</a></li>
                  <li><a href="https://download.bls.gov/pub/time.series/la/la.area" target='_blank'>Area Codes</a></li>
                  <li><a href="https://download.bls.gov/pub/time.series/la/la.measure" target='_blank'>Measurement Types</a></li>
                </ul>
                <li>CPI</li>
                <ul>
                  <li><a href='https://www.bls.gov/bls/inflation.htm' target='_blank'>Inflation (CPI)</a></li>
                  <li><a href='https://www.bls.gov/help/hlpforma.htm#AP' target='_blank'>Timeseries Code Naming Convention (AP - Average Price)</a></li>
                  <li><a href='https://download.bls.gov/pub/time.series/ap/ap.area' target='_blank'>Areas</a></li>
                  <li><a href='https://download.bls.gov/pub/time.series/ap/ap.item' target='_blank'>Items</a></li>
                </ul>
                <li>Interesting</li>
                <ul>
                  <li>https://www.bls.gov/charts/state-employment-and-unemployment/state-unemployment-rates-map.htm#</li>
                  <li>https://www.bls.gov/eag/eag.us.htm</li>
                  <li>https://data.bls.gov/series-report - Series ID Checker</li>
                </ul>
              </ul>
            </ul>
          </Card>
          <Card className={styles.card} style={{border:"none"}}>
            <p className="mt-3 text-muted" >Disclaimer:
              This dashboard is for informational purposes only. The data is not financial advice, and users should conduct their own research before making decisions.
            </p>
          </Card>
        </Col>
        <Col className="d-inline-block justify-content-center mb-3">
          {/* empty column to ensure grid-like layout for charts */}
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
