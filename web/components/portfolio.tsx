import { Chart } from "react-google-charts";

const pieChartData = [
  ["Stock", "Ammount"],
  ["StockA", 1],
  ["StockB", 2],
  ["StockC", 3],
  ["StockD", 4],
];

const Portfolio = () => {
  return (
    <div className="relative pt-full">
      <div className="absolute inset-0">
        <Chart
          chartType="PieChart"
          height="100%"
          data={pieChartData}
          options={{ legend: null }}
        />
      </div>
    </div>
  );
};

export default Portfolio;
