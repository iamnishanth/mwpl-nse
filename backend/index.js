const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const fetchMWPL = require("./api/fetchMWPL");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/fetchMWPL", fetchMWPL);

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
