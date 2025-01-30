import { useState } from "react";

export const useResetFilters = (initialColumns, orders) => {
  const [showDialog, setShowDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [timeRange, setTimeRange] = useState("allTime");
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState(orders);
  const [columns, setColumns] = useState(initialColumns);

  const handleReset = () => {
    setShowDialog(true);
  };

  const handleOk = () => {
    setSearchTerm("");
    setSelectedStatuses([]);
    setTimeRange("allTime");
    setCustomStartDate(null);
    setCustomEndDate(null);
    setFilteredData(orders);
    setColumns(initialColumns);
    setShowDialog(false);
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  return { showDialog, searchTerm, selectedStatuses, timeRange, customStartDate, customEndDate, filteredData, columns, setSearchTerm, setSelectedStatuses, setTimeRange, setCustomStartDate, setCustomEndDate, handleReset, handleOk, handleCancel };
};
