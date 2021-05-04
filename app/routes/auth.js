const { authenticate } = await use("app/hooks/authenticate.js");
const { Controller } = await use("core/Controller.js");

export const route = async (server) => {
  server.post("/register", await Controller.use("AuthController", "register"));
  server.post("/login", await Controller.use("AuthController", "login"));
  server.post(
    "/get-password-reset-token",
    await Controller.use("AuthController", "getPasswordResetToken")
  );
  server.post(
    "/reset-password",
    { preHandler: [authenticate({ optional: true })] },
    await Controller.use("AuthController", "resetPassword")
  );
};
