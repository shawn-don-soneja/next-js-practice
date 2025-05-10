'use client';  // Client-side rendering

import React, { useEffect, useState } from 'react';
import styles from "../styles/charts.module.css";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { Chart } from 'react-google-charts';
import Badge from 'react-bootstrap/Badge'

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
  return <h2 className="m-2">Algo trading coming!</h2>;

  // Render chart after data is loaded
  return (
    <>hello</>
  );
};

export default Page;
