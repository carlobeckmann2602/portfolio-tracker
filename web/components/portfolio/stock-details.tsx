import { PortfolioItem } from ".";

export function StockDetails({ stock }: { stock: PortfolioItem }) {
  return (
    <div>
      <div className="w-4/5 self-center">
        <div className="flex flex-row">
          <div className="rounded-full w-16 h-16 bg-gray-600 mr-6 mb-6"></div>
          <div>
            <h2 className="text-4xl mb-2 font-medium">{stock.name}</h2>
            <p className="text-2xl">{stock.value.toFixed(2)}€</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            <p className="font-medium text-2xl">Current price:</p>
            <p className="text-2xl">{stock.currentPrice}€</p>
          </div>
          <div className="flex flex-row justify-between">
            <p className="font-medium text-2xl">Trend:</p>
            <p className="text-2xl">{stock.trend}%</p>
          </div>
          <div className="flex flex-row justify-between">
            <p className="font-medium text-2xl">Count:</p>
            <div className="flex flex-row items-center">
              <button className="text-2xl rounded-md border border-black w-11 h-11">
                -
              </button>
              <p className="text-2xl p-3">0</p>
              <button className="text-2xl rounded-md border border-black w-11 h-11">
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      <button className="text-2xl rounded-md border border-black w-[350px] h-20">
        Remove all
      </button>
    </div>
  );
}
