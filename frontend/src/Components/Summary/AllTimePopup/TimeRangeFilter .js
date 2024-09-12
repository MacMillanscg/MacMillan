import React, { useState, useEffect, useRef } from "react";
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

  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsVisible(false);
        setSelectedOption("allTime"); // Reset to default when closing
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setTimeRange(option); // Function to set the time range in the parent component
    if (option !== "custom") {
      setIsVisible(false); // Close the popup after selection if not custom
    }
  };

  const toggleVisibility = () => {
    // If popup is already visible and we close it, reset the selected option
    setIsVisible(!isVisible);
    if (!isVisible) {
      setSelectedOption("allTime"); // Reset the selected option when reopening
    }
  };

  return (
    <div className={styles.timeRangeFilter} ref={popupRef}>
      <button className={styles.timeRangeButton} onClick={toggleVisibility}>
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

      {/* Show time options when visible */}
      {isVisible && selectedOption !== "custom" && (
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
      )}

      {/* Custom date picker shown only when 'Custom Period' is selected */}
      {isVisible && selectedOption === "custom" && (
        <div className={styles.customPeriod}>
          <div className={styles.fullCalendarContainer}>
            <div className={styles.calendarSection}>
              <label>From</label>
              <DatePicker
                selected={customStartDate}
                onChange={(date) => setCustomStartDate(date)}
                selectsStart
                startDate={customStartDate}
                endDate={customEndDate}
                inline
              />
            </div>
            <div className={styles.calendarSection}>
              <label>To</label>
              <DatePicker
                selected={customEndDate}
                onChange={(date) => setCustomEndDate(date)}
                selectsEnd
                startDate={customStartDate}
                endDate={customEndDate}
                minDate={customStartDate}
                inline
              />
            </div>
          </div>
          <div className={styles.buttonsContainer}>
            <button
              className={styles.cancelButton}
              onClick={() => setIsVisible(false)}
            >
              Cancel
            </button>
            <button className={styles.searchButton}>Search</button>
          </div>
        </div>
      )}
    </div>
  );
};
