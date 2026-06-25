const { calculateTax } = require('../taxCalculator');

describe('TaxCalculator', () => {
  
  describe('calculateTax', () => {
    
    it('deberia calcular el impuesto correctamente', () => {
      const result = calculateTax(1000, 16);
      expect(result.amount).toBe(1000);
      expect(result.taxRate).toBe(16);
      expect(result.tax).toBe(160);
      expect(result.total).toBe(1160);
    });

    it('deberia manejar impuesto del 0%', () => {
      const result = calculateTax(500, 0);
      expect(result.tax).toBe(0);
      expect(result.total).toBe(500);
    });

    it('deberia manejar monto de 0', () => {
      const result = calculateTax(0, 21);
      expect(result.tax).toBe(0);
      expect(result.total).toBe(0);
    });

    it('deberia redondear correctamente', () => {
      const result = calculateTax(100, 7.5);
      expect(result.tax).toBe(7.5);
      expect(result.total).toBe(107.5);
    });

    it('deberia manejar decimales', () => {
      const result = calculateTax(150.50, 10);
      expect(result.tax).toBe(15.05);
      expect(result.total).toBe(165.55);
    });

    it('deberia lanzar error si amount no es numero', () => {
      expect(() => calculateTax('abc', 16)).toThrowError('Amount and tax rate must be numbers');
    });

    it('deberia lanzar error si taxRate no es numero', () => {
      expect(() => calculateTax(100, 'abc')).toThrowError('Amount and tax rate must be numbers');
    });

  });

});
