import { Application } from "./core/Application.js";

const app = new Application();

await app.bootstrap();
await app.listen();
