const express = require('express');
const path = require('path');
const { calculateTax } = require('./taxCalculator');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/api/calculate', (req, res) => {
  const { amount, taxRate } = req.body;
  try {
    const result = calculateTax(parseFloat(amount), parseFloat(taxRate));
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

module.exports = app;
