import { useState } from "preact/hooks";

export const StockList = ({ mwplData }) => {
  const [minDifference, setMinDifference] = useState(5);
  const [filterStocks, setFilterStocks] = useState(false);

  let stockList = null;

  if (mwplData) {
    if (filterStocks) {
      stockList = mwplData.filter(
        (stock) =>
          stock.current_mwpl_percentage - stock.prev_mwpl_percentage > minDifference ||
          stock.current_mwpl_percentage - stock.prev_mwpl_percentage < -minDifference
      );
    } else {
      stockList = mwplData;
    }
  }

  return (
    <main className="stock-list-container">
      {mwplData && (
        <div className="filter-toggle">
          <p className="filter-toggle-text">
            Filter stocks that have minimum{" "}
            <input
              className="min-diff"
              type="number"
              max={100}
              min={0}
              defaultValue={minDifference}
              onChange={(e) => setMinDifference(e.target.value)}
            />{" "}
            % difference
          </p>
          <label class="switch">
            <input type="checkbox" defaultChecked={filterStocks} onChange={() => setFilterStocks((prev) => !prev)} />
            <span class="slider" />
          </label>
        </div>
      )}
      <ul className="stock-list">
        {mwplData &&
          stockList &&
          stockList.map((stock) => {
            if (stock.current_mwpl_percentage && stock.prev_mwpl_percentage) {
              return <StockItem stock={stock} key={stock.nse_symbol} />;
            }
          })}
      </ul>
    </main>
  );
};

const StockItem = ({ stock }) => {
  return (
    <li>
      <div>{stock.scrip_name}</div>
      <div
        className={
          stock.current_mwpl_percentage - stock.prev_mwpl_percentage > 0 ? "change-diff green" : "change-diff red"
        }
      >
        {(stock.current_mwpl_percentage - stock.prev_mwpl_percentage).toFixed(2)}
      </div>
    </li>
  );
};
