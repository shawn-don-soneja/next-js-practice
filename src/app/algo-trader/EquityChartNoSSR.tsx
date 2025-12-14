"use client";
import dynamic from 'next/dynamic';
import React from 'react';

const EquityChart = dynamic(() => import('./EquityChart'), { ssr: false });

export default function EquityChartNoSSR(props: any) {
  return <EquityChart {...props} />;
}
