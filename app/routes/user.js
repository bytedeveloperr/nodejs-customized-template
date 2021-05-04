const { Controller } = await use("core/Controller.js");

export const route = async (app) => {
  app.get(
    "/confirm-email/:id",
    await Controller.use("UserController", "confirmEmail")
  );
  app.get(
    "/get-email-confirmation",
    await Controller.use("UserController", "getEmailConfirmationToken")
  );
};
