import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
