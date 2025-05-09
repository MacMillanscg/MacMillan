import { useState } from "react";

export const useTimeRangeFilter = () => {
  const [timeRange, setTimeRange] = useState("allTime");
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  return {
    timeRange,
    customStartDate,
    customEndDate,
    setTimeRange,
    setCustomStartDate,
    setCustomEndDate,
  };
};
