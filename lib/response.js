import fastifyPlugin from "fastify-plugin";

export const response = fastifyPlugin(async function (fastify, options, done) {
  function successReply(message, data) {
    this.send({ status: "success", message, data });
  }
  function errorReply(message, data) {
    this.send({ status: "error", message, data });
  }

  fastify.decorateReply("success", successReply);
  fastify.decorateReply("error", errorReply);

  done();
});
