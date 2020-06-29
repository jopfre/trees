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
  const formatDate = (label) => {
    const date = new Date(label);
    const dateStr = date.toLocaleDateString("en-US");
    return dateStr.substring(0, dateStr.length - 2);
  };
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={props.data}
        margin={{ top: 32, right: 32, bottom: 32, left: 32 }}
      >
        <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          minTickGap={20}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(label) => formatDate(label)}
        >
          <Label value="Date" dy={32} position="insideBottom" />
        </XAxis>
        <YAxis dataKey="value" axisLine={false} tickMargin={8}>
          <Label
            value="Trees planted"
            dx={-28}
            angle={-90}
            position="insideLeft"
          />
        </YAxis>
        <Tooltip
          labelFormatter={(label) => formatDate(label)}
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
