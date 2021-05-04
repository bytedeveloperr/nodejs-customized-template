const fastifyCors = await use("fastify-cors");
const formBodyPlugin = await use("fastify-formbody");
const fastifyHelmet = await use("fastify-helmet");
const pointOfView = await use("point-of-view");
const { response } = await use("lib/response.js");

export const plugins = [
  fastifyCors,
  fastifyHelmet,
  formBodyPlugin,
  response,
  { main: pointOfView, options: { engine: { ejs: await use("ejs") } } },
];
