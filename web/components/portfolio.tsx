import { Chart } from "react-google-charts";

const treeMapData = [
  ["Name", "Parent", "Ammount", ""],
  ["Portfolio", null, 0, 0],
  ["StockA", "Portfolio", 1, 0],
  ["StockB", "Portfolio", 2, 0],
  ["StockC", "Portfolio", 3, 0],
  ["StockD", "Portfolio", 4, 0],
];

const treeMapOptions = {
  minColor: "#f00",
  midColor: "#ddd",
  maxColor: "#0d0",
  headerHeight: 0,
  fontColor: "black",

  eventsConfig: {
    highlight: [],
    unhighlight: [],
    rollup: [],
    drilldown: [],
    select: [],
  },
};

const pieChartData = [
  ["Stock", "Ammount"],
  ["StockA", 1],
  ["StockB", 2],
  ["StockC", 3],
  ["StockD", 4],
];

const pieChartOptions = {
  title: "My Stock Portfolio",
};

const Portfolio = () => {
  return (
    <>
      <h1 className="text-2xl">Portfolio</h1>
      <div className="flex-col items-center justify-between">
        <Chart
          chartType="TreeMap"
          width="100%"
          height="400px"
          data={treeMapData}
          options={treeMapOptions}
        />
        <Chart
          chartType="PieChart"
          width={"100%"}
          height={"400px"}
          data={pieChartData}
          options={pieChartOptions}
        />
      </div>
    </>
  );
};

export default Portfolio;
