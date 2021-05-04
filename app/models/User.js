const { PrismaModel } = await use("core/model/PrismaModel.js");

export class User extends PrismaModel {
  static schema = "user";

  static jsonSchema = {
    type: "object",
    properties: {
      name: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
      username: { type: "string" },
    },
    required: ["name", "email", "password", "username"],
  };
}
