"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
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

  // Column resizing state/ref
  const [ordersColWidths, setOrdersColWidths] = useState<number[]>([120, 200, 80, 150]);
  const [logsColWidths, setLogsColWidths] = useState<number[]>([120, 180, 80, 300]);
  const resizingRef = useRef<{ table: 'orders' | 'logs'; colIndex: number; startX: number; startWidth: number } | null>(null);

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
    overflowY: "auto",
    overflowX: "auto",
    position: "relative",
  };

  const stickyThStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 3,
    cursor: "pointer",
  };

  const resizeHandleStyle: React.CSSProperties = {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    width: 8,
    cursor: 'col-resize',
    zIndex: 6,
    background: 'transparent'
  };

  const clamp = (v: number, min = 40, max = 2000) => Math.max(min, Math.min(max, v));

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const info = resizingRef.current;
      if (!info) return;
      const delta = e.clientX - info.startX;
      const newWidth = clamp(info.startWidth + delta);
      if (info.table === 'orders') {
        setOrdersColWidths((w) => {
          const copy = [...w];
          copy[info.colIndex] = newWidth;
          return copy;
        });
      } else {
        setLogsColWidths((w) => {
          const copy = [...w];
          copy[info.colIndex] = newWidth;
          return copy;
        });
      }
    };

    const onMouseUp = () => {
      resizingRef.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    // attach/detach handled by mousedown handler which adds these listeners
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const startResize = (e: React.MouseEvent, table: 'orders' | 'logs', colIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = table === 'orders' ? (ordersColWidths[colIndex] ?? 100) : (logsColWidths[colIndex] ?? 100);
    resizingRef.current = { table, colIndex, startX, startWidth };
    const onMouseMove = (ev: MouseEvent) => {
      const info = resizingRef.current;
      if (!info) return;
      const delta = ev.clientX - info.startX;
      const newWidth = clamp(info.startWidth + delta);
      if (info.table === 'orders') {
        setOrdersColWidths((w) => {
          const copy = [...w];
          copy[info.colIndex] = newWidth;
          return copy;
        });
      } else {
        setLogsColWidths((w) => {
          const copy = [...w];
          copy[info.colIndex] = newWidth;
          return copy;
        });
      }
    };
    const onMouseUp = () => {
      resizingRef.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Minimal sample renderers — use filtered arrays and add scroll wrapper
  const OrdersTable = (
    <Card className="h-100">
      <Card.Header>
        <h3>Orders</h3>
        <span className='text-secondary'>DynamoDB:</span> <code>Financial_Data_Orders</code>
      </Card.Header>
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
          <Table responsive striped bordered size="sm" className="mb-0" style={{ minWidth: orderTableMinWidth, tableLayout: 'fixed' }}>
            <colgroup>
              {ordersColWidths.map((w, i) => (
                <col key={i} style={{ width: `${w}px` }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th onClick={() => toggleOrdersSort("Id")} style={{ ...stickyThStyle, position: 'sticky' }}>
                  <div style={{ position: 'relative' }}>Id{arrow(ordersSortKey, "Id", ordersSortDir)}
                    <div title="Resize" role="separator" aria-orientation="horizontal" style={resizeHandleStyle} onMouseDown={(e) => startResize(e, 'orders', 0)} />
                  </div>
                </th>
                <th onClick={() => toggleOrdersSort("symbol")} style={{ ...stickyThStyle, position: 'sticky' }}>
                  <div style={{ position: 'relative' }}>Symbol{arrow(ordersSortKey, "symbol", ordersSortDir)}
                    <div title="Resize" role="separator" aria-orientation="horizontal" style={resizeHandleStyle} onMouseDown={(e) => startResize(e, 'orders', 1)} />
                  </div>
                </th>
                <th onClick={() => toggleOrdersSort("qty")} style={{ ...stickyThStyle, position: 'sticky' }}>
                  <div style={{ position: 'relative' }}>Qty{arrow(ordersSortKey, "qty", ordersSortDir)}
                    <div title="Resize" role="separator" aria-orientation="horizontal" style={resizeHandleStyle} onMouseDown={(e) => startResize(e, 'orders', 2)} />
                  </div>
                </th>
                <th onClick={() => toggleOrdersSort("status")} style={{ ...stickyThStyle, position: 'sticky' }}>
                  <div style={{ position: 'relative' }}>Status{arrow(ordersSortKey, "status", ordersSortDir)}
                    <div title="Resize" role="separator" aria-orientation="horizontal" style={resizeHandleStyle} onMouseDown={(e) => startResize(e, 'orders', 3)} />
                  </div>
                </th>
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
      <Card.Header>
        <h3>Process Logs</h3>
        <span className='text-secondary'>DynamoDB:</span> <code>Automated_Process_Logs</code>
      </Card.Header>
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
        <div style={tableWrapperStyle}>
          <Table responsive striped bordered size="sm" className="mb-0" style={{ minWidth: logsTableMinWidth, tableLayout: 'fixed' }}>
            <colgroup>
              {logsColWidths.map((w, i) => (
                <col key={i} style={{ width: `${w}px` }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th onClick={() => toggleLogsSort("Id")} style={{ ...stickyThStyle, position: 'sticky' }}>
                  <div style={{ position: 'relative' }}>Id{arrow(logsSortKey, "Id", logsSortDir)}
                    <div title="Resize" role="separator" aria-orientation="horizontal" style={resizeHandleStyle} onMouseDown={(e) => startResize(e, 'logs', 0)} />
                  </div>
                </th>
                <th onClick={() => toggleLogsSort("CreatedDate")} style={{ ...stickyThStyle, position: 'sticky' }}>
                  <div style={{ position: 'relative' }}>Created{arrow(logsSortKey, "CreatedDate", logsSortDir)}
                    <div title="Resize" role="separator" aria-orientation="horizontal" style={resizeHandleStyle} onMouseDown={(e) => startResize(e, 'logs', 1)} />
                  </div>
                </th>
                <th onClick={() => toggleLogsSort("Status")} style={{ ...stickyThStyle, position: 'sticky' }}>
                  <div style={{ position: 'relative' }}>Status{arrow(logsSortKey, "Status", logsSortDir)}
                    <div title="Resize" role="separator" aria-orientation="horizontal" style={resizeHandleStyle} onMouseDown={(e) => startResize(e, 'logs', 2)} />
                  </div>
                </th>
                <th onClick={() => toggleLogsSort("Description")} style={{ ...stickyThStyle, position: 'sticky' }}>
                  <div style={{ position: 'relative' }}>Description{arrow(logsSortKey, "Description", logsSortDir)}
                    <div title="Resize" role="separator" aria-orientation="horizontal" style={resizeHandleStyle} onMouseDown={(e) => startResize(e, 'logs', 3)} />
                  </div>
                </th>
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
