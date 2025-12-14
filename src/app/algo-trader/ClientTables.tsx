"use client";

import React, { useMemo, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

type Order = { Id?: string; [key: string]: any };
type Log = { Id?: string; CreatedDate?: string; Status?: string; Description?: string; [key: string]: any };

const normalize = (v: any) => (v === null || v === undefined ? "" : String(v));

function sortBy<T>(arr: T[], key: string | null, dir: "asc" | "desc") {
  if (!key) return arr.slice();
  const sorted = arr.slice().sort((a: any, b: any) => {
    const va = normalize(a[key]).toLowerCase();
    const vb = normalize(b[key]).toLowerCase();
    if (va < vb) return -1;
    if (va > vb) return 1;
    return 0;
  });
  return dir === "asc" ? sorted : sorted.reverse();
}

export default function ClientTables({ orders = [], processLogs = [], extraTables = [] }: { orders?: Order[]; processLogs?: Log[]; extraTables?: React.ReactNode[] }) {
  // Logs table state
  const [logsQuery, setLogsQuery] = useState("");
  const [logsSortKey, setLogsSortKey] = useState<string | null>(null);
  const [logsSortDir, setLogsSortDir] = useState<"asc" | "desc">("asc");

  // Orders table state
  const [ordersQuery, setOrdersQuery] = useState("");
  const [ordersSortKey, setOrdersSortKey] = useState<string | null>(null);
  const [ordersSortDir, setOrdersSortDir] = useState<"asc" | "desc">("asc");

  const filteredLogs = useMemo(() => {
    const q = logsQuery.trim().toLowerCase();
    let arr = processLogs || [];
    if (q) {
      arr = arr.filter((r) => {
        return (
          normalize(r.Id).toLowerCase().includes(q) ||
          normalize(r.CreatedDate).toLowerCase().includes(q) ||
          normalize(r.Status).toLowerCase().includes(q) ||
          normalize(r.Description).toLowerCase().includes(q)
        );
      });
    }
    return sortBy(arr, logsSortKey, logsSortDir);
  }, [processLogs, logsQuery, logsSortKey, logsSortDir]);

  const filteredOrders = useMemo(() => {
    const q = ordersQuery.trim().toLowerCase();
    let arr = orders || [];
    if (q) {
      arr = arr.filter((r) => {
        const json = JSON.stringify(r).toLowerCase();
        return normalize(r.Id).toLowerCase().includes(q) || json.includes(q);
      });
    }
    return sortBy(arr, ordersSortKey, ordersSortDir);
  }, [orders, ordersQuery, ordersSortKey, ordersSortDir]);

  // NEW: derive dynamic columns for orders (exclude Id)
  const orderColumns = useMemo(() => {
    const cols = new Set<string>();
    (orders || []).forEach((o) => {
      Object.keys(o || {}).forEach((k) => {
        if (k !== "Id") cols.add(k);
      });
    });
    // stable order: sort alphabetically
    return Array.from(cols).sort();
  }, [orders]);

  // New: table min-width helpers so columns have room
  const logsTableMinWidth = 700;
  const orderTableMinWidth = Math.max(800, orderColumns.length * 150);

  const toggleLogsSort = (key: string) => {
    if (logsSortKey === key) {
      setLogsSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setLogsSortKey(key);
      setLogsSortDir("asc");
    }
  };

  const toggleOrdersSort = (key: string) => {
    if (ordersSortKey === key) {
      setOrdersSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setOrdersSortKey(key);
      setOrdersSortDir("asc");
    }
  };

  const arrow = (activeKey: string | null, key: string, dir: "asc" | "desc") => {
    if (activeKey !== key) return "";
    return dir === "asc" ? " ▲" : " ▼";
  };

  const renderOrderCell = (record: Order, key: string) => {
    const v = record[key];
    if (v === null || v === undefined) return "N/A";
    if (typeof v === "object") return JSON.stringify(v);
    return String(v);
  };

  const tableWrapperStyle: React.CSSProperties = {
    maxHeight: 400,
    overflow: "auto",
    position: "relative",
  };

  const stickyThStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 3,
    cursor: "pointer",
  };

  // Minimal sample renderers — use filtered arrays and add scroll wrapper
  const OrdersTable = (
    <Card className="h-100">
      <Card.Header>Orders</Card.Header>
      <Card.Body style={{ padding: 0 }}>
        <div style={{ padding: 8 }}>
          {/* optional search input if you want to use the existing query state */}
          <Form.Control
            size="sm"
            placeholder="Filter orders..."
            value={ordersQuery}
            onChange={(e) => setOrdersQuery(e.target.value)}
            className="mb-2"
          />
        </div>
        <div style={tableWrapperStyle}>
          <Table responsive striped bordered size="sm" className="mb-0" style={{ minWidth: orderTableMinWidth }}>
            <thead>
              <tr>
                <th onClick={() => toggleOrdersSort("Id")} style={stickyThStyle}>Id{arrow(ordersSortKey, "Id", ordersSortDir)}</th>
                <th onClick={() => toggleOrdersSort("symbol")} style={stickyThStyle}>Symbol{arrow(ordersSortKey, "symbol", ordersSortDir)}</th>
                <th onClick={() => toggleOrdersSort("qty")} style={stickyThStyle}>Qty{arrow(ordersSortKey, "qty", ordersSortDir)}</th>
                <th onClick={() => toggleOrdersSort("status")} style={stickyThStyle}>Status{arrow(ordersSortKey, "status", ordersSortDir)}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length ? filteredOrders.map((o) => (
                <tr key={o.Id || JSON.stringify(o)}>
                  <td>{o.Id}</td>
                  <td>{o.symbol || ""}</td>
                  <td>{o.qty ?? ''}</td>
                  <td>{o.status ?? ''}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="text-muted">No orders</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );

  const LogsTable = (
    <Card className="h-100">
      <Card.Header>Process Logs</Card.Header>
      <Card.Body style={{ padding: 0 }}>
        <div style={{ padding: 8 }}>
          {/* optional search input if you want to use the existing query state */}
          <Form.Control
            size="sm"
            placeholder="Filter logs..."
            value={logsQuery}
            onChange={(e) => setLogsQuery(e.target.value)}
            className="mb-2"
          />
        </div>
        <div style={{ ...tableWrapperStyle, minWidth: logsTableMinWidth }}>
          <Table responsive striped bordered size="sm" className="mb-0">
            <thead>
              <tr>
                <th onClick={() => toggleLogsSort("Id")} style={stickyThStyle}>Id{arrow(logsSortKey, "Id", logsSortDir)}</th>
                <th onClick={() => toggleLogsSort("CreatedDate")} style={stickyThStyle}>Created{arrow(logsSortKey, "CreatedDate", logsSortDir)}</th>
                <th onClick={() => toggleLogsSort("Status")} style={stickyThStyle}>Status{arrow(logsSortKey, "Status", logsSortDir)}</th>
                <th onClick={() => toggleLogsSort("Description")} style={stickyThStyle}>Description{arrow(logsSortKey, "Description", logsSortDir)}</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length ? filteredLogs.map((l) => (
                <tr key={l.Id || JSON.stringify(l)}>
                  <td>{l.Id}</td>
                  <td>{l.CreatedDate}</td>
                  <td>{l.Status}</td>
                  <td>{l.Description}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="text-muted">No logs</td></tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );

  // Compose all cards/tables into the grid and include extraTables so they wrap automatically
  const tables: React.ReactNode[] = [OrdersTable, LogsTable, ...extraTables];

  return (
    <Row className="g-3">
      {tables.map((table, idx) => (
        // xs=12 -> full width on mobile
        // md=6 -> two columns on md+ screens
        <Col key={idx} xs={12} md={6}>
          {table}
        </Col>
      ))}
    </Row>
  );
}
