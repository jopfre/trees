import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  YAxis,
  XAxis,
  Label,
  Tooltip,
} from "recharts";

function Chart(props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={props.data}
        margin={{ top: 32, right: 32, bottom: 32, left: 32 }}
      >
        <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" minTickGap={20}>
          <Label value="Date" dy={24} position="insideBottom" />
        </XAxis>
        <YAxis dataKey="value">
          <Label
            value="Trees planted"
            dx={-20}
            angle={-90}
            position="insideLeft"
          />
        </YAxis>
        <Tooltip
          formatter={(value, name) => [
            new Intl.NumberFormat("en").format(value),
            "Trees",
          ]}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
export default Chart;
