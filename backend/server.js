const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Routes
const itemsRoutes = require('./routes/items');
const categoriesRoutes = require('./routes/categories');

app.use('/api/items', itemsRoutes);
app.use('/api/categories', categoriesRoutes);

app.get('/', (req, res) => {
    res.send('Market List API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
