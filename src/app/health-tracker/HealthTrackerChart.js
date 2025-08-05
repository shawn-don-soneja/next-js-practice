'use client';

import React from 'react';
import { Card, Container } from 'react-bootstrap';
import { Chart } from 'react-google-charts';

const equityData = {
  timestamp: [
    1745452800, 1745539200, 1745625600, 1745884800, 1745971200,
    1746057600, 1746144000, 1746230400, 1746489600, 1746576000,
    1746662400, 1746748800, 1746835200, 1747094400, 1747180800,
    1747267200, 1747353600, 1747440000, 1747699200, 1747785600,
    1747872000, 1747958400, 1748044800
  ],
  equity: [
    11242.94, 11398.94, 11566.94, 11460.88, 11708.88,
    12160.88, 12604.88, 13928.88, 13928.88, 13004.88,
    13004.88, 13004.88, 13254.88, 15183.35, 15183.35,
    15560.35, 15560.35, 15932.35, 15923.29, 16205.29,
    15881.29, 15115.29, 14143.29
  ]
};

// Format data for Google Charts
const chartData = [
  ['Date', 'Equity'],
  ...equityData.timestamp.map((ts, i) => [
    new Date(ts * 1000),
    equityData.equity[i]
  ])
];

const options = {
  title: 'Equity Over Time',
  curveType: 'function',
  legend: { position: 'none' },
  hAxis: { format: 'MMM dd' },
};

export default function HealthTrackerChart() {
  return (
    <Container className="my-4">
      <Card className="p-3">
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={chartData}
          options={options}
        />
      </Card>
    </Container>
  );
}
