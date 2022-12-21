require('dotenv').config();
const cors = require('cors');
const express = require('express');

const PORT = process.env.PORT || 8080;
const sizeRouter = require('./routes/size.routes');
const cartRouter = require('./routes/cart.routes');
const categoryRouter = require('./routes/category.routes');
const clothesRouter = require('./routes/clothes.routes');
const colorRouter = require('./routes/color.routes');

const app = express();
const corsOptions = {
  origin: 'http://127.0.0.1:5500',
  credentials: true,
  optionSuccessStatus: 200,
  // methods: ['GET', 'POST', 'DELETE', 'PUT'],
};
app.get('/', (req, res) => {
  res.send('Hello!');
});
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb', extended: true, parameterLimit: 10000 }));

app.use('/picture', express.static(__dirname + '/public/images'));
app.use('/api', sizeRouter);
app.use('/api', clothesRouter);
app.use('/api', categoryRouter);
app.use('/api', colorRouter);
app.use('/api', cartRouter);

app.listen(PORT, () => console.log('server listening on port ' + PORT));
