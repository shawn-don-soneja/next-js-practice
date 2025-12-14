"use client";
import dynamic from 'next/dynamic';
import React from 'react';

const StrategySelection = dynamic(() => import('./StrategySelection'), { ssr: false });

export default function StrategySelectionNoSSR(props: any) {
  return <StrategySelection {...props} />;
}
