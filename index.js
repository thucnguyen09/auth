const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./config/db');
const dotenv = require('dotenv');
const router = require('./routers');
const morgan = require('morgan');
const port = 8000;
const app = express();

dotenv.config();
// cors origin
app.use(cors());
// create and assign cookie
app.use(cookieParser());
// req and res format with json
app.use(express.json());
app.use(morgan('combined'))

router(app);
//connect db
db.connect();
app.listen(port, () => {
    console.log('server is running...');
});