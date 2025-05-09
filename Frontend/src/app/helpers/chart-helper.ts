export const chartOptions = (label: string): any => {
  return {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: label,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: false,
        },
        grid: {
          color: '#3d3b3b',
          lineWidth: 0.5,
        },
      },
      y: {
        display: true,
        title: {
          display: false,
        },
        grid: {
          color: '#3d3b3b',
          lineWidth: 0.5,
        },
      },
    },
  };
};
