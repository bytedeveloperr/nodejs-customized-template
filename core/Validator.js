import Ajv from "ajv";
import normaliseAjvErrors from "ajv-error-messages";

export class Validator {
  constructor(options = {}) {
    this.ajv = new Ajv({ allErrors: true, ...options });
  }

  validate(schema, json) {
    const validate = this.ajv.compile(schema);
    const valid = validate(json);
    if (!valid) {
      const errors = validate.errors;
      const refined = [];
      let field, limit;

      for (let i = 0; i < errors.length; i++) {
        switch (errors[i].keyword) {
          case "required":
            field = errors[i].params.missingProperty;
            refined.push(`${field} is a required field`);
            break;
          case "maxLength":
            field = errors[i].instancePath.replace("/", "");
            refined.push(`${field} ${errors[i].message}`);
            break;
          case "minLength":
            field = errors[i].instancePath.replace("/", "");
            refined.push(`${field} ${errors[i].message}`);
            break;
          case "type":
            field = errors[i].instancePath.replace("/", "");
            refined.push(`${field} ${errors[i].message}`);
            break;
          case "minimum":
            field = errors[i].instancePath.replace("/", "");
            limit = errors[i].params.limit;
            refined.push(`${field} must not be less than ${limit}`);
            break;
          case "maximum":
            field = errors[i].instancePath.replace("/", "");
            limit = errors[i].params.limit;
            refined.push(`${field} must not be greater than ${limit}`);
            break;
          default:
            field = errors[i].instancePath.replace("/", "");
            refined.push(errors[i].message);
        }
      }
      throw { validationError: true, error: { refined, raw: errors } };
    }

    return valid;
  }
}
