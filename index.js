import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import GeneralController from './server/controllers/GeneralController';
import SupplierController from './server/controllers/SupplierController';

dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_HOSTS;

app.use(cors({
  origin(origin, callback) {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not '
                + 'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
}));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/banks', GeneralController.getAllBanks);
app.get('/resolve_account', GeneralController.resolveAccountNumber);
app.post('/suppliers', SupplierController.create);
app.get('/suppliers', SupplierController.list);
app.get('/transfers', GeneralController.getAllTransfers);
app.post('/transfers', GeneralController.performTransfer);

app.get('/', (req, res) => {
  res.send({ message: 'success' });
});


const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`server started ${port}`)); // eslint-disable-line no-console

module.exports = app;
