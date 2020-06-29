import React, { useState, useEffect } from "react";
import axios from "axios";
import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider, Layout, Card, Link } from "@shopify/polaris";

import Chart from "./components/Chart";
import DatePicker from "./components/DatePicker";

import { ReactComponent as LoadingIcon } from "./assets/loading-icon.svg";

import "./App.css";

function App() {
  const [processedData, setProcessedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalTreesPlanted, setTotalTreesPlanted] = useState([]);
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
  const [isError, setIsError] = useState(false);

  const processData = (rawData) => {
    let processedData = [];
    let totalTreesPlanted = 0;
    // Reformat data so planting events are grouped by date and are in format recharts requires
    rawData.forEach((plantingEvent) => {
      let newEventDate = plantingEvent.createdAt.substr(
        0,
        plantingEvent.createdAt.indexOf("T")
      );
      let existingDateIndex = processedData.findIndex(
        (singleDate) => singleDate.date === newEventDate
      );
      if (existingDateIndex > -1) {
        processedData[existingDateIndex].value += plantingEvent.value;
      } else {
        processedData.push({
          date: newEventDate,
          value: plantingEvent.value,
        });
      }
      totalTreesPlanted += plantingEvent.value;
    });
    setTotalTreesPlanted(totalTreesPlanted);
    // Sort by date
    processedData.sort(function (a, b) {
      return a.date.localeCompare(b.date);
    });
    return processedData;
  };

  // Fetch data from API, process that data and set dependant states
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios(apiUrl);
        return await result.data;
      } catch (error) {
        throw Error(error);
      }
    };

    setIsLoading(true);
    setIsError(false);

    fetchData()
      .then((rawData) => {
        const processedData = processData(rawData);
        setProcessedData(processedData);
        setFilteredData(processedData);
        setDefaultSelectedDates({
          start: new Date(processedData[0].date),
          end: new Date(processedData[processedData.length - 1].date),
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsError(true);
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

      let filteredData = processedData.filter(isBetweenSelectedDates);
      setFilteredData(filteredData);
      let totalTreesPlanted = 0;
      filteredData.forEach((plantingDay) => {
        totalTreesPlanted += plantingDay.value;
      });
      setTotalTreesPlanted(totalTreesPlanted);
    };
    filterData(appSelectedDates);
  }, [appSelectedDates, processedData]);

  return (
    <AppProvider i18n={enTranslations}>
      <div id="app">
        {isLoading ? (
          <div className="loading">
            <LoadingIcon />
            <br />
            {isError ? (
              <p>Something went wrong, please try again later.</p>
            ) : (
              <p>Loading</p>
            )}
          </div>
        ) : (
          <Layout>
            <Layout.Section>
              <Card title="Trees planted by date" sectioned>
                <p>
                  Total trees planted for selected range: {totalTreesPlanted}
                </p>
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
                  data={processedData}
                  setAppSelectedDates={setAppSelectedDates}
                  defaultSelectedDates={defaultSelectedDates}
                />
              </Card>

              <Card title="About" sectioned>
                <Card.Section title="Built by">
                  <Link url="https://www.linkedin.com/in/jonah-freeland-6386a329/">
                    Jonah Freeland
                  </Link>
                </Card.Section>
                <Card.Section title="Data from">
                  <Link url="https://offset.earth">Offset Earth</Link>
                </Card.Section>
                <Card.Section title="Code stored on">
                  <Link url="https://github.com/jopfre/trees">GitHub</Link>
                </Card.Section>
              </Card>
            </Layout.Section>
          </Layout>
        )}
      </div>
    </AppProvider>
  );
}

export default App;
