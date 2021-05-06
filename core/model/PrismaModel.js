import Prisma from "@prisma/client";
import { Validator } from "../Validator.js";

const validator = new Validator();

export class PrismaModel {
  static schema = "";
  static prisma = new Prisma.PrismaClient();
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

    return modelClass.prisma[modelClass.schema].create({
      data: this.fields,
      ...options,
    });
  }

  static create(data, options) {
    if (this.jsonSchema) {
      validator.validate(this.jsonSchema, this.fields);
    }

    return this.prisma[this.schema].create({
      data,
      ...options,
    });
  }

  static findById(id, options = {}) {
    return this.prisma[this.schema].findFirst({
      where: { id },
      ...options,
    });
  }

  static find(where, options = {}) {
    return this.prisma[this.schema].findMany({
      where,
      ...options,
    });
  }

  static findOne(query, options) {
    return this.prisma[this.schema].findFirst({
      where: query,
      ...options,
    });
  }

  static updateOne(where, data, options = {}) {
    return this.prisma[this.schema].update({
      where,
      data,
      ...options,
    });
  }

  static updateMany(where, data, options = {}) {
    return this.prisma[this.schema].updateMany({
      where,
      data,
      ...options,
    });
  }

  static deleteOne(criteria, options = {}) {
    return this.prisma[this.schema].delete({
      where: criteria,
      ...options,
    });
  }

  static $transaction(args) {
    return this.prisma.$transaction(args);
  }
}
