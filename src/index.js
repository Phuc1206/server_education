const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const PORT = 3001;
app.use(express.static('public'));
const route = require('./routes');
const db = require('./config/db');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

route(app);
db.connect();

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
