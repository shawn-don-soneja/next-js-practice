"use client";
import React, { useMemo } from 'react';
import { Card } from 'react-bootstrap';
import { Chart } from 'react-google-charts';
import { mergeSeries } from '../../lib/formatForReactGoogleCharts';

const defaultEquityData = {
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

// used for data retrieval from Alpaca Portfolio History
type EquityInput = {
  timestamp?: number[];
  equity?: number[];
  profit_loss?: number[];
  profit_loss_pct?: number[];
  base_value?: number;
  base_value_asof?: string;
  timeframe?: string;
};

export default function EquityChart({ input, spyData }: { input?: any, spyData?: any}) {
  console.log('loading equity chart');
  console.log('1', input);
  console.log('2', spyData);

  const chartData = useMemo(() => {
    console.log('ugh 0');
    if (input.length <= 0) return [['Date', 'Equity']];
    console.log('ugh 1');

    if (spyData != null && input != null) {
      console.log('about to merge');
      const portfolioAndSpy = mergeSeries(input, spyData);
      console.log('merged: ', portfolioAndSpy);
      return portfolioAndSpy;
    }
    
    return [
      ['Date', 'Equity'],
      []
    ];
  }, [input, spyData]);

  const options = {
    title: 'Equity Over Time',
    curveType: 'function',
    legend: { position: 'none' },
    hAxis: { format: 'MMM dd' },
    vAxis: { title: 'Equity' },
    explorer: { axis: 'horizontal', keepInBounds: true },
    colors: ["#e69138", "#097138"],
  };

  return (
    <Card className="h-100">
      <Card.Header>
        <h3>Portfolio Value</h3>
        <span className='text-secondary'>Alpaca:</span> <code>/account/portfolio/history?period=1M&timeframe=1D</code>
      </Card.Header>
      <Card.Body style={{ padding: 0 }}>
        <Chart
          chartType="LineChart"
          width="100%"
          height="320px"
          data={chartData}
          options={options}
          loader={<div style={{ padding: 20 }}>Loading chart...</div>}
        />
      </Card.Body>
    </Card>
  );
}
