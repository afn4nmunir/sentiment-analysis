// Charts.jsx
import React from "react";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend
} from "recharts";

const data = [
  { name: "Week 1", articles: 40, companies: 5 },
  { name: "Week 2", articles: 55, companies: 8 },
  { name: "Week 3", articles: 20, companies: 3 },
  { name: "Week 4", articles: 75, companies: 10 },
];

export const PlaceholderLineChart = () => {
  return (
    <LineChart width={400} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="articles" stroke="#8884d8" strokeWidth={2} />
    </LineChart>
  );
};

export const PlaceholderBarChart = () => {
  return (
    <BarChart width={400} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="companies" fill="#82ca9d" />
    </BarChart>
  );
};

const pieData = [
  { name: 'Tech', value: 35 },
  { name: 'Finance', value: 25 },
  { name: 'Healthcare', value: 15 },
  { name: 'Retail', value: 25 },
];

export const PlaceholderPieChart = () => {
  return (
    <PieChart width={300} height={300}>
      <Tooltip />
      <Legend />
      <Pie
        data={pieData}
        cx={150}
        cy={150}
        labelLine={false}
        outerRadius={100}
        dataKey="value"
      >
        {pieData.map((entry, index) => (
          <Cell
            key={index}
            fill={`hsl(${index * 60}, 70%, 60%)`}
          />
        ))}
      </Pie>
    </PieChart>
  );
};
