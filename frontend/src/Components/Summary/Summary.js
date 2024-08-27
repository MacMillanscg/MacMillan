import React, { useState } from "react";
import styles from "./Summary.module.css";
import { useAppContext } from "../Context/AppContext";
import { MokeData } from "./MockData";

export const Summary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState(MokeData);
  const { dashboardWidth } = useAppContext();

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <div className={styles.summaryHeader}>
        <h1 className={styles.title}>Transaction Summary</h1>

        <div className={styles.filters}>
          {/* <div className="form-group"> */}
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`form-control me-4 ${styles.searchBar}`}
          />
          {/* </div> */}

          <div className={`${styles.dateFilters} me-5`}>
            <div className="form-group d-flex align-items-center">
              <label>Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className={`form-control ${styles.dateInput}`}
              />
            </div>

            <div className="form-group d-flex align-items-center">
              <label>End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className={`form-control ${styles.dateInput}`}
              />
            </div>
          </div>

          <div className={styles.statusFilter}>
            <label>Status:</label>
            <select
              value={status}
              onChange={handleStatusChange}
              className={styles.select}
            >
              <option value="">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Shipment Number</th>
              <th>Platform</th>
              <th>Shipment Status</th>
              <th>Client</th>
              <th>Tracking Number</th>
              <th>Tracking URL</th>
              <th>Labels</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.orderNumber}</td>
                <td>{item.shipmentNumber}</td>
                <td>{item.platform}</td>
                <td>{item.shipmentStatus}</td>
                <td>{item.client}</td>
                <td>{item.trackingNumber}</td>
                <td>
                  <a
                    href={item.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Track
                  </a>
                </td>
                <td>{item.labels.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
