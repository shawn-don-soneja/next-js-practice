"use client";
import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import ClientTables so it is only rendered on the client
const ClientTables = dynamic(() => import('./ClientTables'), { ssr: false });

export default function ClientTablesNoSSR(props: any) {
  return <ClientTables {...props} />;
}
