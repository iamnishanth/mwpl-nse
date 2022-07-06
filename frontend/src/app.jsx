import { Header } from "./components/Header";
import { useState } from "preact/hooks";
import { StockList } from "./components/StockList";

export function App() {
  const [mwplData, setMWPLData] = useState(null);
  return (
    <div className="full-screen">
      <Header setMWPLData={setMWPLData} />
      <StockList mwplData={mwplData} />
    </div>
  );
}
