import { Server, Request, ResponseToolkit } from "@hapi/hapi";
import routes from "./api/books/routes.js";
import connect from "./utils/db.js";

const init = async () => {
  const server: Server = new Server({
    port: 5000,
    host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await connect();

  server.route(routes);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();
