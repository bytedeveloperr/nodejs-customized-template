const jwt = await use("jsonwebtoken");
const { User } = await use("app/models/User.js");
const { Messages } = await use("app/helpers/Messages.js");
const { auth } = await use("config/auth.js");

export const authenticate = (options = {}) => async (request, _reply) => {
  const authHeader = request.headers.authorization;

  if (!authHeader && !options.optional) {
    throw new Error(Messages.error.authenticationRequired);
  } else {
    if (!authHeader) {
      request.user = null;
    } else {
      const split = authHeader?.split(" ");
      if (split[0] !== "Bearer") {
        throw new Error(Messages.error.authenticationRequired);
      }
      const { id } = await jwt.verify(split[1], auth.jwt.secret);
      if (!id) {
        throw new Error(Messages.error.authenticationRequired);
      }
      const user = await User.findOne({ id });
      if (!user && !options.optional) {
        throw new Error(Messages.error.authenticationRequired);
      }
      request.user = user || null;
    }
  }
};
