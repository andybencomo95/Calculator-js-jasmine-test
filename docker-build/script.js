document.getElementById('taxForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var amount = parseFloat(document.getElementById('amount').value);
  var taxRate = parseFloat(document.getElementById('taxRate').value);
  var resultDiv = document.getElementById('result');

  try {
    var result = calculateTax(amount, taxRate);
    document.getElementById('resAmount').textContent = result.amount.toFixed(2);
    document.getElementById('resTax').textContent = result.tax.toFixed(2);
    document.getElementById('resRate').textContent = result.taxRate;
    document.getElementById('resTotal').textContent = result.total.toFixed(2);
    resultDiv.className = 'result';
    resultDiv.style.display = 'block';
  } catch (err) {
    resultDiv.className = 'result error';
    resultDiv.innerHTML = '<p>' + err.message + '</p>';
    resultDiv.style.display = 'block';
  }
});
