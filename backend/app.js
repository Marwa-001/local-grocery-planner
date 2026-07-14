require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.use('/', require('./src/routes/auth.routes'));
app.use('/', require('./src/routes/product.routes'));
app.use('/', require('./src/routes/category.routes'));
app.use('/', require('./src/routes/list.routes'));
app.use('/', require('./src/routes/listItem.routes'));
app.use('/', require('./src/routes/favourite.routes'));

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));