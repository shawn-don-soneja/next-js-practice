"use client";

import React, { useMemo, useState } from "react";
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

export default function ClientTables({ processLogs, orders }: { processLogs: Log[]; orders: Order[] }) {
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

  return (
    <>
      <div className="mb-3">
        <h3 className="m-3">Automated Process Logs ({filteredLogs.length})</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "center", paddingLeft: 16, paddingRight: 16 }}>
          <Form.Control
            placeholder="Search logs (Id, date, status, description)..."
            value={logsQuery}
            onChange={(e) => setLogsQuery(e.target.value)}
          />
          <Button variant="secondary" onClick={() => setLogsQuery("")}>Clear</Button>
        </div>
        {/* Allow horizontal scrolling and give table a minimum width */}
        <div style={{ maxHeight: "400px", overflowY: "auto", padding: 16, overflowX: "auto" }}>
          <Table striped bordered hover style={{ minWidth: logsTableMinWidth }}>
            <thead>
              <tr>
                <th>#</th>
                <th style={{ cursor: "pointer" }} onClick={() => toggleLogsSort("Id")}>
                  Log Id{arrow(logsSortKey, "Id", logsSortDir)}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => toggleLogsSort("CreatedDate")}>
                  Created Date{arrow(logsSortKey, "CreatedDate", logsSortDir)}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => toggleLogsSort("Status")}>
                  Status{arrow(logsSortKey, "Status", logsSortDir)}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => toggleLogsSort("Description")}>
                  Description{arrow(logsSortKey, "Description", logsSortDir)}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5}>No records found</td>
                </tr>
              ) : (
                filteredLogs.map((record, i) => (
                  <tr key={record.Id || i}>
                    <td>{i + 1}</td>
                    <td>{record.Id || "N/A"}</td>
                    <td>{record.CreatedDate || "N/A"}</td>
                    <td>{record.Status || "N/A"}</td>
                    <td style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{record.Description || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      <div className="mb-3">
        <h3 className="m-3">Financial Data Orders ({filteredOrders.length})</h3>
        <div style={{ display: "flex", gap: 8, alignItems: "center", paddingLeft: 16, paddingRight: 16 }}>
          <Form.Control
            placeholder="Search orders (Id or JSON)..."
            value={ordersQuery}
            onChange={(e) => setOrdersQuery(e.target.value)}
          />
          <Button variant="secondary" onClick={() => setOrdersQuery("")}>Clear</Button>
        </div>
        {/* Allow horizontal scrolling and give table a minimum width based on number of columns */}
        <div style={{ maxHeight: "400px", overflowY: "auto", padding: 16, overflowX: "auto" }}>
          <Table striped bordered hover style={{ minWidth: orderTableMinWidth }}>
            <thead>
              <tr>
                <th>#</th>
                <th style={{ cursor: "pointer" }} onClick={() => toggleOrdersSort("Id")}>
                  Id{arrow(ordersSortKey, "Id", ordersSortDir)}
                </th>
                {orderColumns.map((col) => (
                  <th key={col} style={{ cursor: "pointer", whiteSpace: "nowrap" }} onClick={() => toggleOrdersSort(col)}>
                    {col}{arrow(ordersSortKey, col, ordersSortDir)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={2 + orderColumns.length}>No records found</td>
                </tr>
              ) : (
                filteredOrders.map((record, i) => (
                  <tr key={record.Id || i}>
                    <td>{i + 1}</td>
                    <td>{record.Id || "N/A"}</td>
                    {orderColumns.map((col) => (
                      <td key={col} style={{ verticalAlign: "top" }}>
                        <div style={{ margin: 0, whiteSpace: "pre-wrap", overflowX: "auto", fontFamily: "monospace" }}>
                          {renderOrderCell(record, col)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}
