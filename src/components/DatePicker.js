import React, { useState, useCallback, useEffect } from "react";
import { DatePicker as PolarisDatePicker } from "@shopify/polaris";

import "@shopify/polaris/styles.css";

function DatePicker(props) {
  //Define Polaris attribute values from props. These are calculated based on the processed data in App.
  const startDate = props.defaultSelectedDates.start;
  const endDate = props.defaultSelectedDates.end;

  const [{ month, year }, setDate] = useState({
    month: startDate.getMonth(),
    year: startDate.getFullYear(),
  });
  const [selectedDates, setSelectedDates] = useState({
    start: startDate,
    end: endDate,
  });

  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    []
  );

  // Set selected dates in the App component
  const { setAppSelectedDates } = props;
  useEffect(() => {
    setAppSelectedDates(selectedDates);
  }, [selectedDates, setAppSelectedDates]);

  return (
    <PolarisDatePicker
      month={month}
      year={year}
      onChange={setSelectedDates}
      onMonthChange={handleMonthChange}
      selected={selectedDates}
      allowRange={true}
      disableDatesBefore={startDate}
      disableDatesAfter={endDate}
    />
  );
}
export default DatePicker;
