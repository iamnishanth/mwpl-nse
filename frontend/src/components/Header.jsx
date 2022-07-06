import axios from "axios";
import { useState } from "preact/hooks";

const SERVER_URL = "https://mwpl-server.herokuapp.com/fetch_mwpl";

export const Header = ({ setMWPLData }) => {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMWPL = async () => {
    setLoading(true);
    const modifiedDate1 = date1.split("-").reverse().join("").trim();
    const modifiedDate2 = date2.split("-").reverse().join("").trim();
    if (modifiedDate1.length !== 0 && modifiedDate2.length !== 0 && modifiedDate1 === modifiedDate2) {
      setLoading(false);
      setError("Date cannot be same!");
      setMWPLData(null);
      return;
    }
    if (modifiedDate1.length !== 0 && modifiedDate2.length !== 0) {
      try {
        let res = await axios.post(SERVER_URL, {
          date1: modifiedDate1,
          date2: modifiedDate2,
        });
        if (res.status === 200) {
          setError(null);
          const date1Data = res.data[modifiedDate1];
          const date2Data = res.data[modifiedDate2];
          let stockList = [];
          for (let key of Object.keys(date1Data)) {
            if (date2Data[key]) {
              let obj = {};
              obj["nse_symbol"] = key;
              obj["scrip_name"] = date1Data[key]["scrip_name"];
              obj["prev_limit"] = date1Data[key]["limit_for_next_day"];
              obj["current_limit"] = date2Data[key]["limit_for_next_day"];
              obj["prev_mwpl"] = date1Data[key]["mwpl"];
              obj["current_mwpl"] = date2Data[key]["mwpl"];
              obj["prev_mwpl_percentage"] = date1Data[key]["mwpl_percentage"];
              obj["current_mwpl_percentage"] = date2Data[key]["mwpl_percentage"];
              obj["prev_oi"] = date1Data[key]["open_interest"];
              obj["current_oi"] = date2Data[key]["open_interest"];
              stockList.push(obj);
            }
            // if (date1Data[key].mwpl_percentage && date2Data[key] && date2Data[key].mwpl_percentage) {
            //   const difference = date2Data[key].mwpl_percentage - date1Data[key].mwpl_percentage;
            //   if (difference > 3) {
            //     console.log(date1Data[key], difference);
            //   }
            // }
          }
          stockList = stockList.sort((a, b) => (a.scrip_name > b.scrip_name) - (a.scrip_name < b.scrip_name));
          setMWPLData(stockList);
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
        setError("MWPL data cannot be found for the given date");
        setMWPLData(null);
      }
    } else {
      setLoading(false);
      setError("Enter date");
      setMWPLData(null);
    }
  };

  return (
    <header className="header">
      <h1 className="title">Compare MWPL Difference</h1>
      <div className="date-container">
        <label className="date">
          Previous
          <input type="date" onChange={(e) => setDate1(e.target.value)} />
        </label>
        <label className="date">
          Current
          <input type="date" onChange={(e) => setDate2(e.target.value)} />
        </label>
      </div>
      <button className="compare-btn" onClick={fetchMWPL} disabled={loading}>
        {loading ? "Loading..." : "Compare"}
      </button>
      {error && <p className="error-msg">{error}</p>}
    </header>
  );
};
