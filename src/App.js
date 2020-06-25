import React, { Component } from "react";
import { ResponsiveContainer, LineChart, Line, YAxis, XAxis } from "recharts";
import enTranslations from "@shopify/polaris/locales/en.json";
import { Card, RangeSlider } from "@shopify/polaris";
import "@shopify/polaris/styles.css";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.processPlantingEvents = this.processPlantingEvents.bind(this);
    this.state = {
      treesPlantedByDate: [],
    };
  }

  processPlantingEvents(plantingEvents) {
    let treesPlantedByDate = [];
    plantingEvents.forEach((plantingEvent) => {
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

    this.setState({ treesPlantedByDate });
  }

  componentDidMount() {
    fetch("https://api.offset.earth/trees")
      .then((response) => response.json())
      .then((plantingEvents) => this.processPlantingEvents(plantingEvents));
  }

  componentDidUpdate() {
    console.log(this.state.treesPlantedByDate);
  }

  render() {
    const { treesPlantedByDate } = this.state;
    return (
      <div id="app">
        <ResponsiveContainer width="100%" height="80%">
          <LineChart width={400} height={400} data={treesPlantedByDate}>
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
            <YAxis dataKey="value" />
            <XAxis dataKey="date" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default App;
