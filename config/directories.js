import path from "path";

export const directories = {
  routes: path.resolve("app", "routes"),
  controllers: path.resolve("app", "controllers"),
  services: path.resolve("app", "services"),
  plugins: path.resolve(".", "plugins"),
};
