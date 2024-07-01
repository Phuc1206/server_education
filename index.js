const express = require("express");
const app = express();
const PORT = 8000;

const route = require('./routes');
const db = require('./config/db');

route(app)
db.connect();

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });


