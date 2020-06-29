import React, { useState, useCallback, useEffect } from "react";
import { DatePicker as PolarisDatePicker } from "@shopify/polaris";

import "@shopify/polaris/styles.css";

function DatePicker(props) {
  let startDate = props.defaultSelectedDates.start;
  let endDate = props.defaultSelectedDates.end;
  /*
   ** Define Polaris attribute values from data
   ** TODO: investigate a bug with the default selected dates. These are getting set after the data fetch in App but then need to be overwritten here to prevent unintended behavior with the PolarisDatePicker changing which dates are available. Ideally these values could be pulled straight from the props.
   */
  if (props.data.length > 0) {
    startDate = new Date(props.data[0].date);
    endDate = new Date(props.data[props.data.length - 1].date);
  }

  const [{ month, year }, setDate] = useState({
    month: startDate.getMonth(),
    year: startDate.getFullYear(),
  });
  const [selectedDates, setSelectedDates] = useState({
    start: startDate,
    end: endDate,
  });
  const { setAppSelectedDates } = props;

  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    []
  );

  // Set selected dates in the App component
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
      disableDatesBefore={new Date(startDate.setDate(startDate.getDate() - 1))}
      disableDatesAfter={endDate}
    />
  );
}
export default DatePicker;
