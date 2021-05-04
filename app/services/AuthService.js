const argon2 = await use("argon2");
const jwt = await use("jsonwebtoken");
const { User } = await use("app/models/User.js");
const { Messages } = await use("app/helpers/Messages.js");
const { random } = await use("core/utils/random.js");
const { auth } = await use("config/auth.js");

export class AuthService {
  async register({ body }) {
    try {
      const existingUser = await User.findOne({ email: body.email });
      if (existingUser) {
        throw new Error(Messages.error.emailAlreadyExist);
      }
      const hashedPassword = await argon2.hash(body.password);
      const emailConfirmationToken = await random.id();

      const userConstruct = {
        name: body.name,
        email: body.email,
        username: body.username,
        password: hashedPassword,
        emailConfirmationToken,
      };

      let user = new User(userConstruct);
      user = await user.save();
      return await jwt.sign({ id: user.id }, auth.jwt.secret);
    } catch (e) {
      if (e.validationError) {
        throw new Error(e.error.refined[0]);
      }
      throw new Error(e.message);
    }
  }

  async login({ body }) {
    const existingUser = await User.findOne({ email: body.email });
    if (!existingUser) {
      throw new Error(Messages.error.emailDoesNotExist);
    }
    if (!(await argon2.verify(existingUser.password, body.password))) {
      throw new Error(Messages.error.incorrectPassword);
    }

    return await jwt.sign({ id: existingUser.id }, auth.jwt.secret);
  }

  async getPasswordResetToken({ query }) {
    const emailExist = await User.findOne({ email: query.email });

    if (!emailExist) {
      throw new Error(Messages.error.emailDoesNotExist);
    }
    const passwordResetToken = await random.id();
    await User.updateOne({ id: emailExist.id }, { passwordResetToken });

    // TODO: Send Email implementation here
    return;
  }

  async resetPassword({ query, body, user }) {
    if (query.token) {
      const userExist = await User.findOne({ passwordResetToken: query.token });
      if (!userExist) {
        throw new Error(Messages.error.invalidResetLink);
      }
      // check whether old password is the same as new password and throw an error if so
      if (await argon2.verify(userExist.password, body.newPassword)) {
        throw new Error(Messages.error.newPasswordCannotMatchOld);
      }
      const password = await argon2.hash(body.newPassword);
      await User.updateOne(
        { id: userExist.id },
        { password, passwordResetToken: null }
      );
    } else if (body.oldPassword) {
      // check whether old password is correct and throw an errof if not
      if (!(await argon2.verify(user?.password, body.oldPassword))) {
        throw new Error(Messages.error.invalidOldPassword);
      }
      // check whether old password is the same as new password and throw an error if so
      if (await argon2.verify(user?.password, body.newPassword)) {
        throw new Error(Messages.error.newPasswordCannotMatchOld);
      }
      const password = await argon2.hash(body.newPassword);
      await User.updateOne(
        { id: user?.id },
        { password, passwordResetToken: null }
      );
    }
    return;
  }
}
