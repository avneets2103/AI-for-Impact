// components/Chart.tsx
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    ChartOptions,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
  import { FC } from 'react';
  import { useTheme } from "next-themes";
  
  // Register required elements
  ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);
  
  interface ChartProps {
    labels: string[];
    data: number[];
    ytitle: string;
    xtitle: string;
    name: string;
    xlabelOn: boolean
  }
  
  const Chart: FC<ChartProps> = ({ labels, data, ytitle,  xtitle, name, xlabelOn}) => {
    const { theme, setTheme } = useTheme();
    const chartData = {
      labels,
      datasets: [
        {
          label: name,
          data,
          borderColor: theme==="dark"?"#CCC":"#333",
          borderWidth: 2,
          fill: true,
          backgroundColor: theme==="dark"?"#7379FF":"#7379FF",
        },
      ],
    };
  
    const options: ChartOptions<'line'> = {
      scales: {
        x: {
          title: {
            display: xlabelOn,
            text: xtitle,
          },
        },
        y: {
          title: {
            display: true,
            text: ytitle,
          },
        },
      },
      interaction: {
        mode: 'point',
        intersect: false,
      },
      responsive: true,
    };
  
    return <Line data={chartData} options={options} />;
  };
  
  export default Chart;
  