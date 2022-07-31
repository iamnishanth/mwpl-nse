const express = require("express");
const axios = require("axios");
const AdmZip = require("adm-zip");

const router = express.Router();

/**
 * Gets MWPL data from NSE
 * @param {string} date
 */
const fetchMWPL = async (date) => {
    const NSE_URL = "https://www1.nseindia.com/archives/nsccl/mwpl/combineoi_" + date + ".zip";
    try {
        let res = await axios.get(NSE_URL, {
            responseType: "arraybuffer",
        });
        return res;
    } catch (e) {
        console.log("here", e);
        return {
            status: 404,
        };
    }
};

/**
 * Converts CSV to JSON
 * @param {string} csv
 */
const formatJSON = (csv) => {
    const lines = csv.split("\n").filter((line) => line.trim().length > 0);
    let results = {};
    const headers = lines[0].split(",").map((item) => item.trim().split(" ").join("_").toLowerCase());
    for (let i = 1; i < lines.length; i++) {
        let obj = {};
        const currentLine = lines[i].split(",");

        for (let j = 0; j < currentLine.length; j++) {
            obj[headers[j]] = currentLine[j].replace(/(\r\n|\n|\r)/gm, "");
        }
        if (obj["limit_for_next_day"] !== "No Fresh Positions") {
            obj["mwpl_percentage"] = (parseInt(obj["limit_for_next_day"]) / parseInt(obj["mwpl"])) * 100;
        } else {
            obj["mwpl_percentage"] = null;
        }
        results[obj["nse_symbol"]] = obj;
    }
    return results;
};

/**
 * POST Get MWPL data.
 * @return mwpl data for two dates | error.
 */
router.post("/", async (req, res) => {
    const date1 = req.body.date1;
    const date2 = req.body.date2;

    const date1Response = await fetchMWPL(date1);
    const date2Response = await fetchMWPL(date2);
    if (date1Response.status === 200 && date2Response.status === 200) {
        const date1Zip = new AdmZip(date1Response.data);
        const date1CSV = date1Zip.readAsText("combineoi_" + date1 + ".csv");
        const date1JSON = formatJSON(date1CSV);

        const date2Zip = new AdmZip(date2Response.data);
        const date2CSV = date2Zip.readAsText("combineoi_" + date2 + ".csv");
        const date2JSON = formatJSON(date2CSV);

        let response = {};
        response[date1] = date1JSON;
        response[date2] = date2JSON;

        res.status(200).json(response);
    } else {
        res.status(404).json({ message: "MWPL data not found" });
    }
});

module.exports = router;
