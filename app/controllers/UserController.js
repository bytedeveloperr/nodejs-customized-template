const { Controller } = await use("core/Controller.js");
const { Messages } = await use("app/helpers/Messages.js");

export class UserController extends Controller {
  constructor(request, reply) {
    super(request, reply);
  }

  async confirmEmail() {
    const { request, reply, service } = this;
    await service.confirmEmail({
      query: request.query,
      params: request.params,
    });
    return reply.success(Messages.success.confirmEmailSuccess);
  }

  async getEmailConfirmationToken() {
    const { request, reply, service } = this;
    await service.getEmailConfirmationToken({ query: request.query });
    return reply.success(Messages.success.confirmEmailSent);
  }
}
