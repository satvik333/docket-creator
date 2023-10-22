const express = require('express');
const fs = require('fs');
const XLSX = require('xlsx');
const cors = require('cors');
const mongoose = require('mongoose');
const { createDocket, getDockets } = require('./controller/docketController');
const bodyParser = require('body-parser');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017')
  .then(() => {
    console.log('Database connection is successful');
  })
  .catch((err) => {
    console.log('Error when connecting to the database' + err);
  })

app.post('/adddocket', async (req, res) => {
  return await createDocket(req, res);
});

app.get('/getdockets', async (req, res) => {
  return await getDockets(req, res);
});

app.get('/readFile', async (req, res) => {
  try {
    const data = fs.readFileSync('./export29913.xlsx');
    const workbook = XLSX.read(data, {
      type: 'buffer',
    });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    });

    const poNumberIndex = jsonData[0].indexOf('PO Number');
    const supplierIndex = jsonData[0].indexOf('Supplier');
    const descriptionIndex = jsonData[0].indexOf('Description');

    const dataObjects = [];
    let previousSupplier = '';

    for (let i = 1; i < jsonData.length; i++) {
      const poNumber = jsonData[i][poNumberIndex];
      let supplier = jsonData[i][supplierIndex];
      const description = jsonData[i][descriptionIndex];

      if (!supplier) {
        supplier = previousSupplier;
      } else {
        previousSupplier = supplier;
      }

      if (poNumber && supplier) {
        dataObjects.push({
          poNumber,
          supplier,
          description,
        });
      }
    }

    res.json(dataObjects);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
