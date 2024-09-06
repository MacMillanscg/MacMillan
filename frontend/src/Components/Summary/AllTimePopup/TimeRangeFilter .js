import React, { useState } from "react";
import styles from "./TimeRangeFilter.module.css"; // Adjust path as necessary
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const TimeRangeFilter = ({
  setTimeRange,
  timeRange,
  customStartDate,
  customEndDate,
  startDate,
  endDate,
  setCustomStartDate,
  setCustomEndDate,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("allTime");

  const timeOptions = [
    { label: "All Time", value: "allTime" },
    { label: "Today", value: "today" },
    { label: "This Week", value: "thisWeek" },
    { label: "This Month", value: "thisMonth" },
    { label: "Custom Period", value: "custom" },
  ];

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setIsVisible(false);
    setTimeRange(option); // Function to set the time range in the parent component
  };

  return (
    <div className={styles.timeRangeFilter}>
      <button
        className={styles.timeRangeButton}
        onClick={() => setIsVisible(!isVisible)}
      >
        <FontAwesomeIcon
          icon={faCalendar}
          className={`me-2 ${styles.calender}`}
        />
        Time Range
        <FontAwesomeIcon
          icon={isVisible ? faChevronUp : faChevronDown}
          className="ms-2"
        />
      </button>
      {isVisible && (
        <>
          <ul className={styles.timeOptions}>
            {timeOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelectOption(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </>
      )}
      {timeRange === "custom" && (
        <div className={styles.customPeriod}>
          <div className={styles.datePickerContainer}>
            <div className={styles.datePicker}>
              <label>From</label>
              <DatePicker
                selected={customStartDate}
                onChange={(date) => setCustomStartDate(date)}
                // dateFormat="MM/dd/yyyy"
                placeholderText="Select Start Date"
              />
            </div>
            <div className={styles.datePicker}>
              <label>To</label>
              <DatePicker
                selected={customEndDate}
                onChange={(date) => setCustomEndDate(date)}
                // dateFormat="MM/dd/yyyy"
                placeholderText="Select End Date"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
