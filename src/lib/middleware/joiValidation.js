const Joi = require('joi');
const { map, pick } = require('lodash');
const BadRequestError = require('../errors/BadRequestError');

const createValidationError = (error) => {
  const details =
    'details' in error
      ? map(error.details, ({ path, message }) => ({
          path: path.join('.'),
          message: message.replace(/''/g, "'").replace(/(?=(body)|(params)|(query))\w+./, ''),
        }))
      : [{ message: error.message }];
  // const message = details.map((d) => d.message).join(' and ');

  return new BadRequestError('Validation Error', details);
};

const validate = (schema) => (req, res, next) => {
  if (!schema) {
    next();
    return;
  }

  const data = pick(req, ['body', 'params', 'query']);
  const joiSchema = Joi.object(schema);
  const { error, value } = joiSchema.validate(data, { abortEarly: false, allowUnknown: true, stripUnknown: true });

  if (error) {
    const validationErr = createValidationError(error);
    next(validationErr);
    return;
  }

  req.validatedData = value;
  next();
};

module.exports = { validate };
