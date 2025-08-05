"use client"
import React, { useEffect, useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import { Chart } from 'react-google-charts';


export default function HealthTrackerChart() {
  const [chartData, setChartData] = useState([
    ['Date', 'Blood Sugar', 'Weight']
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/retrieveHealthData');
        const result = await res.json();
        if (!res.ok) {
          setError(result.error || 'Error fetching data');
          setLoading(false);
          return;
        }
        const data = result.data;
        if (data && data.length > 0) {
          const formatted = data.map(row => [
            row.created_at ? new Date(row.created_at) : null,
            row.blood_sugar !== null ? Number(row.blood_sugar) : null,
            row.weight !== null ? Number(row.weight) : null
          ]);
          setChartData([
            ['Date', 'Blood Sugar', 'Weight'],
            ...formatted.filter(row => row[0] instanceof Date && !isNaN(row[1]) && !isNaN(row[2]) )
          ]);
        }
      } catch (err) {
        setError('Error fetching data');
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const options = {
    title: 'Health Data Over Time',
    curveType: 'function',
    legend: { position: 'bottom' },
    hAxis: { format: 'MMM dd' },
    series: {
      0: { color: '#e74c3c', targetAxisIndex: 0 }, // Blood Sugar
      1: { color: '#3498db', targetAxisIndex: 1 }  // Weight
    },
    vAxes: {
      0: { title: 'Blood Sugar (mg/dL)' },
      1: { title: 'Weight (lbs)' }
    }
  };

  return (
    <Container className="my-4">
      <Card className="p-3">
        <h3 style={{ textAlign: 'center', marginBottom: 24 }}>Your Health Data</h3>
        {loading ? (
          <div style={{ textAlign: 'center' }}>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>
        ) : (
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={chartData}
            options={options}
          />
        )}
      </Card>
    </Container>
  );
}