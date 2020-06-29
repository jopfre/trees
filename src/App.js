import React, { useState, useEffect } from "react";
import axios from "axios";
import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider, Layout, Card } from "@shopify/polaris";
import { ReactComponent as LoadingIcon } from "./assets/loading-icon.svg";
import Chart from "./components/Chart";
import DatePicker from "./components/DatePicker";

import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [apiUrl] = useState("https://api.offset.earth/trees");
  const [isLoading, setIsLoading] = useState(false);
  // Sensible defaults are set which are replaced when the real data is fetched from the API
  const [defaultSelectedDates, setDefaultSelectedDates] = useState({
    start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), // One year ago
    end: new Date(), //Today
  });
  // Used by DatePicker to set the selected dates for App
  const [appSelectedDates, setAppSelectedDates] = useState({
    start: defaultSelectedDates.start,
    end: defaultSelectedDates.end,
  });

  const processData = (data) => {
    let treesPlantedByDate = [];
    // Reformat data so planting events are grouped by date and are in format recharts requires
    data.forEach((plantingEvent) => {
      let newEventDate = plantingEvent.createdAt.substr(
        0,
        plantingEvent.createdAt.indexOf("T")
      );
      let existingDateIndex = treesPlantedByDate.findIndex(
        (singleDate) => singleDate.date === newEventDate
      );
      if (existingDateIndex > -1) {
        treesPlantedByDate[existingDateIndex].value += plantingEvent.value;
      } else {
        treesPlantedByDate.push({
          date: newEventDate,
          value: plantingEvent.value,
        });
      }
    });
    // Sort by date
    treesPlantedByDate.sort(function (a, b) {
      return a.date.localeCompare(b.date);
    });
    return treesPlantedByDate;
  };

  // Fetch data from API, set default selected dates and loading state
  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      const result = await axios(apiUrl);
      return await result.data;
    };

    fetchData().then((data) => {
      const processedData = processData(data);
      setData(processedData);
      setFilteredData(processedData);
      setDefaultSelectedDates({
        start: new Date(processedData[0].date),
        end: new Date(processedData[processedData.length - 1].date),
      });
      setIsLoading(false);
    });
  }, [apiUrl]);

  // Filter data when date range is selected in DatePicker
  useEffect(() => {
    const filterData = () => {
      function isBetweenSelectedDates(treesPlantedOnDate) {
        let dateTreesPlanted = new Date(treesPlantedOnDate.date);
        return (
          dateTreesPlanted >= appSelectedDates.start &&
          dateTreesPlanted <= appSelectedDates.end
        );
      }

      let filteredData = data.filter(isBetweenSelectedDates);
      setFilteredData(filteredData);
    };
    filterData(appSelectedDates);
  }, [appSelectedDates, data]);

  return (
    <AppProvider i18n={enTranslations}>
      <div id="app">
        {isLoading ? (
          <div className="loading">
            <LoadingIcon />
            <p>Loading</p>
          </div>
        ) : (
          <Layout>
            <Layout.Section>
              <Card title="Trees planted by date" sectioned>
                <Chart data={filteredData} />
              </Card>
            </Layout.Section>
            <Layout.Section secondary>
              <Card title="Date range" sectioned>
                <p>
                  Select two dates to see the number of trees planted between
                  them.
                </p>
                <br />
                <DatePicker
                  data={data}
                  setAppSelectedDates={setAppSelectedDates}
                  defaultSelectedDates={defaultSelectedDates}
                />
              </Card>
            </Layout.Section>
          </Layout>
        )}
      </div>
    </AppProvider>
  );
}

export default App;
