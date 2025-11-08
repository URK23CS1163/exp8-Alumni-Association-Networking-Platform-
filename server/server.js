const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

const User = require('./models/User');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profiles');
const recordsRouter = require('./routes/records');

app.use('/api/auth', authRouter);
app.use('/api/profiles', profileRouter);
app.use('/api/records', recordsRouter);

app.get('/', (req, res) => res.send('Alumni API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`));
