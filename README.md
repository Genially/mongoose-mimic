# mongoose-mimic

mongoose-mimic is a small (but powerful) Node.js library to generate test data for Mongoose using only the schema definition.

## Features

- Generate random values depending on primitive data types (string, number, boolean, date...)
- Generate random values that meet constraints (uppercase, lowercase, max...)
- Generate custom values for specific fields
- Generate custom values that match non-primitive data types for specific fields (email, phone, address...)
- Ignore specific fields
- Generate dates as object or string

## Installation

```
npm install @genially/mongoose-mimic
```

## Usage

### mimic(model, opts)

Generates a mimetic document from `model`

- `model`: Mongoose schema object
- `opts`: Generation options, where the options are in the following format:

```js
        {
          ignore: Array,
          applyFilter: Boolean,
          returnDate: Boolean,
          custom: {
             field: {
               value: Any,
               type: String
             }
          }
        }
```

|       Option       | Type    | Usage                                                                                                                                                                                           |
| :----------------: | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|       ignore       | Array   | It can contains string paths or RegExp of fields to ignore during generation                                                                                                                    |
|    applyFilter     | Boolean | Apply lowercase, uppercase, and trim filters on generated object if defined in the path                                                                                                         |
|     returnDate     | Boolean | Weather to return dates as Date or String                                                                                                                                                       |
|       custom       | Object  | Special generator for specified fields                                                                                                                                                          |
| custom.field.value | Any     | Specific value to generate                                                                                                                                                                      |
| custom.field.type  | String  | Data type to generate, in the format: "type.subtype". Examples: "internet.email" or "address.city". See [Faker.js](https://github.com/marak/Faker.js/) methods to know all supported data types |

---

## Usage Example

```js
const mongoose = require('mongoose');
const mimic = require('@genially/mongoose-mimic');
const ignoredFields = ['_id','created_at', '__v', /detail.*_info/];
const genderValues = ['Male', 'Female']
const schemaDefinition = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
    },
    phones: {
        type: [String],
    }
    birth_date: {
        type: Date
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
const model = mongoose.model('Student', schemaDefinition);
const randomObject = mimic(model, {
    ignore: ignoredFields,
    returnDate: true,
    custom: {
      name: {
        value: 'Mimic',
      },
      email: {
        type: 'internet.email'
      },
      phones: {
        type: 'phone.phoneNumber'
      },
      birth_date: {
        value: () => new Date('December 25, 1995 23:15:30')
      }
    }
})
console.log(randomObject);

/* Result:
{
    "name": "Mimic",
    "data": {
        "az": {
            "name": "Kayden Oberbrunner",
            "email": "Esteban_Bernier@gmail.com",
            "phone": "1-160-514-5977",
            "posts": [{
                "words": "maxime quia sit",
                "sentence": "Fuga vel in architecto ut modi sequi aliquam debitis.",
                "sentences": "Reprehenderit ratione consequuntu.."
            }, {
                "words": "dignissimos qui qui",
                "sentence": "Eveniet est unde quis sit et ab.",
                "sentences": "Sit eos quaerat aut quisquam unde..",
                "paragraph": "Quasi et numquam cumque neque rerum aliquam ullam.."
            }],
            "address": {
                "geo": {
                    "lat": "25.9144",
                    "lng": "6.0991"
                },
                "city": "Amaraville",
                "state": "Indiana",
                "streetA": "O'Conner Prairie",
                "streetB": "5722 Shane Grove",
                "streetC": "8040 Hane Roads Suite 402",
                "streetD": "Apt. 816",
                "country": "Kenya",
                "zipcode": "74052"
            },
            "website": "santina.org",
            "company": {
                "bs": "cross-platform facilitate deliverables",
                "name": "Morissette LLC",
                "catchPhrase": "Self-enabling intangible methodology"
            },
            "username": "Euna44",
            "accountHistory": [{
                "amount": "473.69",
                "date": "2012-02-01T22:00:00.000Z",
                "business": "Lang, Hudson and Heller",
                "name": "Savings Account 3906",
                "type": "invoice",
                "account": "60253551"
            }, {
                "amount": "824.69",
                "date": "2012-02-01T22:00:00.000Z",
                "business": "Rice - Price",
                "name": "Credit Card Account 8924",
                "type": "withdrawal",
                "account": "62599733"
            }]
        }
        }
    },
    "email": "Jacinto.Runolfsdottir@hotmail.com",
    "gender": "Male",
    "parent": "59d0ff689b95b02fec446c55",
    "results": [{
        "score": 87467,
        "course": 56396
    }, {
        "score": 728,
        "course": 80047
    }],
    "birth_date": "1995-12-25T22:15:30.000Z",
    "phones": [
      '(857) 375-1663',
      '(601) 926-2014',
      '(705) 324-8873 x9541',
      '(693) 690-3304 x99775',
      '1-088-666-8801 x6452',
      '1-125-206-1792',
      '607.384.4536',
      '228.058.0088 x91535'
    ]
    "is_student": true,
    "detail": {
        "none_match": "Eugenia_Kuvalis"
    }
}*/
```

## Testing

To run the test cases use `npm test`

## Related libraries

mongoose-mimic API is inspired by [mongoose-dummy](https://github.com/thedgmbh/mongoose-dummy), which provides a more limited capability to customize generated values.

Other similar libraries to generate test data for Mongoose are:

- [mongoose-faker](https://github.com/tnsengimana/mongoose-faker)
- [@lykmapipo/mongoose-faker](https://github.com/lykmapipo/mongoose-faker)
- [Fakegoose](https://github.com/andrejewski/fakegoose)

## License

Licensed under [MIT](LICENSE)
