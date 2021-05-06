import Prisma from "@prisma/client";
import { Validator } from "../Validator.js";

const prisma = new Prisma.PrismaClient();
const validator = new Validator();

export class PrismaModel {
  static schema = "";
  static jsonSchema = null;

  fields = {};

  constructor(fields) {
    Object.assign(this.fields, fields);
  }

  save(options) {
    const modelClass = this.constructor;
    if (modelClass.jsonSchema) {
      validator.validate(modelClass.jsonSchema, this.fields);
    }

    return prisma[modelClass.schema].create({
      data: this.fields,
      ...options,
    });
  }

  static findById(id, options = {}) {
    return prisma[this.schema].findFirst({
      where: { id },
      ...options,
    });
  }

  static find(where, options = {}) {
    return prisma[this.schema].findMany({
      where,
      ...options,
    });
  }

  static findOne(query, options) {
    return prisma[this.schema].findFirst({
      where: query,
      ...options,
    });
  }

  static updateOne(where, data, options = {}) {
    return prisma[this.schema].update({
      where,
      data,
      ...options,
    });
  }

  static deleteOne(criteria, options = {}) {
    return prisma[this.schema].delete({
      where: criteria,
      ...options,
    });
  }

  static $transaction(args) {
    return prisma;
  }
}
