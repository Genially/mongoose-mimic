const mongoose = require('mongoose');
const isObjectId = mongoose.Types.ObjectId.isValid;
const mimic = require('..');
const { validateEmail } = require('./utils');

describe('mongoose-mimic', () => {
  let schemaDefinition;
  let model;
  const genderValues = ['Male', 'Female'];

  beforeAll(async () => {
    schemaDefinition = new mongoose.Schema({
      name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
      },
      email: {
        type: String
      },
      birth_date: {
        type: Date
      },
      phones: {
        type: [String]
      },
      gender: {
        type: String,
        enum: genderValues
      },
      data: {
        type: Object,
        default: null
      },
      results: [
        {
          score: Number,
          course: Number
        }
      ],
      is_student: {
        type: Boolean
      },
      parent: {
        type: mongoose.Schema.Types.ObjectId
      },
      detail: {
        main_info: String,
        some_info: String,
        none_match: String
      },
      created_at: {
        type: Date,
        default: Date.now
      }
    });

    model = mongoose.model('Student', schemaDefinition);
  });

  describe('mongoose model', () => {
    it('should generate random model', done => {
      const randomObject = mimic(model);

      expect(randomObject).not.toBeUndefined();
      expect(randomObject.name).toBeString();
      expect(randomObject.email).toBeString();
      expect(randomObject.detail.main_info).toBeString();
      expect(randomObject.detail.some_info).toBeString();
      expect(randomObject.detail.none_match).toBeString();
      expect(randomObject.birth_date).toBeDate();
      expect(randomObject.created_at).toBeDate();
      expect(genderValues.indexOf(randomObject.gender)).not.toBe(-1);
      expect(randomObject.data).toBeObject();
      expect(randomObject.results).toBeArray();
      expect(randomObject.results[0]).toContainKey('score');
      expect(randomObject.results[1]).toContainKey('course');
      expect(randomObject.is_student).toBeBoolean();
      expect(randomObject.phones).toBeArray();
      expect(randomObject.parent).toBeString();
      expect(isObjectId(randomObject.parent)).toBeTrue();
      expect(randomObject._id).toBeString();
      expect(isObjectId(randomObject._id)).toBeTrue();
      expect(randomObject.__v).toBeNumber();

      done();
    });
  });

  describe('mongoose model with ignored fields', () => {
    it('should generate random model without ignored fields', done => {
      const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/];

      const randomObject = mimic(model, {
        ignore: ignoredFields
      });

      expect(randomObject.created_at).toBeUndefined();
      expect(randomObject._id).toBeUndefined();
      expect(randomObject.__v).toBeUndefined();
      expect(randomObject.detail.main_info).toBeUndefined();
      expect(randomObject.detail.some_info).toBeUndefined();

      done();
    });
  });

  describe('mongoose model with custom fields', () => {
    it('should generate random model with custom fields', done => {
      const randomObject = mimic(model, {
        custom: {
          name: { type: 'internet.email' },
          email: { value: 'test@email.com' },
          is_student: { value: () => true },
          data: {
            value: {
              foo: 'foo',
              bar: 'bar'
            }
          }
        },
        returnDate: true
      });

      expect(validateEmail(randomObject.name)).toBeTrue();
      expect(randomObject.email).toBe('test@email.com');
      expect(randomObject.is_student).toBeTrue();
      expect(randomObject.data).toBeObject();

      done();
    });
  });

  describe('mongoose model with returnData option to false', () => {
    it('should generate random model with date as string', done => {
      const randomObject = mimic(model, { returnDate: false });
      expect(randomObject.birth_date).toBeString();
      expect(randomObject.created_at).toBeString();

      done();
    });
  });
});
