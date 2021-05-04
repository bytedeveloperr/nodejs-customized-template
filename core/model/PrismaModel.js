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

  async save(options) {
    const modelClass = this.constructor;
    if (modelClass.jsonSchema) {
      validator.validate(modelClass.jsonSchema, this.fields);
    }

    return await prisma[modelClass.schema].create({
      data: this.fields,
      ...options,
    });
  }

  static async findById(id, options = {}) {
    return await prisma[this.schema].findFirst({
      where: { id },
      ...options,
    });
  }

  static async find(where, options = {}) {
    return await prisma[this.schema].findMany({
      where,
      ...options,
    });
  }

  static async findOne(query, options) {
    return await prisma[this.schema].findFirst({
      where: query,
      ...options,
    });
  }

  static async updateOne(where, data, options = {}) {
    return await prisma[this.schema].update({
      where,
      data,
      ...options,
    });
  }

  // static async create(data, options = {}) {
  //   return await prisma[this.schema].create({
  //     data,
  //     ...options,
  //   });
  // }

  static async deleteOne(criteria, options = {}) {
    return await prisma[this.schema].delete({
      where: criteria,
      ...options,
    });
  }
}
