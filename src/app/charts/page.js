import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Chart } from "react-google-charts";
import CardInfo from './CardInfo';


export const data = [
  ["Year", "Sales", "Expenses"],
  ["2004", 1000, 400],
  ["2005", 1170, 460],
  ["2006", 660, 1120],
  ["2007", 1030, 540],
];

export const options = {
  title: "Company Performance",
  curveType: "function",
  legend: { position: "bottom" },
  colors: ["#2596be", "#094e89"],
};

const Page = (props) => {
  return (
    <Container>
      <Row>
        <Col>
          <h1 className="mt-4 m-3">Financial Dashboard</h1>
          <h5 className="mt-2 m-3 text-muted">Here, we re tracking four key macroeconomic indicators: <b>Interest Rates, Unemployment, Inflation, and GDP</b></h5>
        </Col>
      </Row>
      <Row>
        
        <Col className="m-3" lg={true}>
          <Card>
            1 of 2
            <Chart
              chartType="LineChart"
              width="100%"
              height="400px"
              data={props.data}
              options={options}
            />
            <CardInfo/>
          </Card>
        </Col>
        <Col className="m-3" sm={true}>
          <Card>
              2 of 2
              <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={data}
                options={options}
              />
            </Card>
        </Col>
      </Row>
      <Row>
        <Col className="m-3">
          <Card>
            1 of 2
            <Chart
              chartType="LineChart"
              width="100%"
              height="400px"
              data={data}
              options={options}
            />
            <CardInfo/>
          </Card>
        </Col>
        <Col className="m-3" >
          <Card>
              2 of 2
              <Chart
                chartType="LineChart"
                width="100%"
                height="400px"
                data={data}
                options={options}
              />
            </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
