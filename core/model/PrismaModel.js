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
}
