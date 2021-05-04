const { User } = await use("app/models/User.js");
const { Messages } = await use("app/helpers/Messages.js");
const { random } = await use("core/utils/random.js");

export class UserService {
  async confirmEmail({ params, query }) {
    const userExist = await User.findOne({
      id: params.id,
      emailConfirmationToken: query.token,
    });

    if (!userExist) {
      throw new Error(Messages.error.invalidConfirmLink);
    }
    await User.updateOne(
      { id: userExist.id },
      { emailConfirmed: true, emailConfirmationToken: null }
    );

    return;
  }

  async getEmailConfirmationToken({ query }) {
    const userExist = await User.findOne({ email: query.email });

    if (!userExist) {
      throw new Error(Messages.error.emailDoesNotExist);
    }
    if (userExist.emailConfirmed) {
      throw new Error(Messages.error.emailAlreadyConfirmed);
    }
    const emailConfirmationToken = await random.id();
    // TODO: Send a confirmation link to user
    await User.updateOne({ id: userExist.id }, { emailConfirmationToken });
    return;
  }
}
