const createCustomGenerator = require('../src/createCustomGenerator');
const { validateEmail } = require('./utils');

describe('createCustomGenerator', () => {
  describe('custom field with fixed value', () => {
    it('should generate a custom generator that always returns the value', done => {
      const customField = { value: 'Test' };
      const customGenerator = createCustomGenerator(customField);

      expect(customGenerator).not.toBeUndefined();
      expect(customGenerator()).toBe('Test');
      expect(customGenerator()).toBe('Test');

      done();
    });
  });

  describe('custom field with value as custom function', () => {
    it('should generate a custom generator that is the custom function', done => {
      const customField = { value: () => Math.random() };
      const customGenerator = createCustomGenerator(customField);

      expect(customGenerator).toBeFunction();
      expect(customGenerator()).toBeNumber();
      expect(customGenerator()).toBeNumber();

      done();
    });
  });

  describe('custom field with type', () => {
    it('should generate a custom generator that returns a value matching the type', done => {
      const customField = { type: 'internet.email' };
      const customGenerator = createCustomGenerator(customField);
      let value = customGenerator();

      expect(customGenerator).not.toBeUndefined();
      expect(value).toBeString();
      expect(validateEmail(value)).toBeTrue();

      value = customGenerator();
      expect(value).toBeString();
      expect(validateEmail(value)).toBeTrue();

      done();
    });
  });

  describe('custom field with fixed value and type', () => {
    it('should generate custom generator that returns the value', done => {
      const customField = { value: 'Test', type: 'internet.email' };
      const customGenerator = createCustomGenerator(customField);
      const value = customGenerator();

      expect(customGenerator).not.toBeUndefined();
      expect(value).toBe('Test');

      done();
    });
  });

  describe('custom field without value or value', () => {
    it('should return undefined', done => {
      const customField = {};
      const customGenerator = createCustomGenerator(customField);

      expect(customGenerator).toBeUndefined();

      done();
    });
  });

  describe('custom field with invalid type', () => {
    it('should throw error', done => {
      const customField = { type: 'invalid.type' };

      expect(() => createCustomGenerator(customField)).toThrow(Error);

      done();
    });
  });
});
