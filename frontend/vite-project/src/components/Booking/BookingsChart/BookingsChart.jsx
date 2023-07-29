import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const BOOKINGS_BUCKETS = {
  Cheap: {
    min: 0,
    max: 600
  },
  Normal: {
    min: 600,
    max: 1200
  },
  Expensive: {
    min: 1200,
    max: 100000000
  }
};

const bookingsChart = props => {
  const chartData = {
    labels: Object.keys(BOOKINGS_BUCKETS),
    datasets: [
      {
        label: "Price Distribution",
        backgroundColor: ["rgba(75,192,192,1)", "#f3ba2f", "#50AF95"],
        borderColor: "black",
        borderWidth: 3,
        data: []
      }
    ],
  };

  const options = {
    legend: {
      display: true,
      position: 'right'
    },
    scales: {
      x: {
        ticks: {
          color: 'white', // Set the font color for x-axis ticks
        },
      },
      y: {
        ticks: {
          color: 'white', // Set the font color for y-axis ticks
        },
      },
    },
  };

  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (
        current.event.price >= BOOKINGS_BUCKETS[bucket].min &&
        current.event.price < BOOKINGS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);

    chartData.datasets[0].data.push(filteredBookingsCount);
  }

  return (
    <div className="chart-container" style={{ width: 700, height: 700, fontSize: 25 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default bookingsChart;
