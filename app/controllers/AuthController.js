const { Controller } = await use("core/Controller.js");
const { Messages } = await use("app/helpers/Messages.js");

export class AuthController extends Controller {
  constructor(request, reply) {
    super(request, reply);
  }

  async register() {
    const { request, reply, service } = this;
    const token = await service.register({ body: request.body });
    return reply.success(Messages.success.registeration, { token });
  }

  async login() {
    const { request, reply, service } = this;
    const token = await service.login({ body: request.body });
    return reply.success(Messages.success.login, { token });
  }

  async getPasswordResetToken() {
    const { request, reply, service } = this;
    await service.getPasswordResetToken({ query: request.query });
    return reply.success(Messages.success.passwordResetTokenSent);
  }

  async resetPassword() {
    const { request, reply, service } = this;
    await service.resetPassword({
      query: request.query,
      body: request.body,
      user: request.user,
    });
    return reply.success(Messages.success.passwordResetSuccess);
  }
}
