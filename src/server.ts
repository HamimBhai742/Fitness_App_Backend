import { Server } from "http";
import config from "./config";
import { app } from "./app";
import { connecteDB } from "./app/DB/connect.db";


const port = config.port || 5001;

async function main() {
  // Express + HTTP server
  const httpServer: Server = app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
 
    connecteDB();
  });

  // graceful shutdown
  const exitHandler = () => {
    if (httpServer) httpServer.close(() => console.info("Server closed!"));
    process.exit(1);
  };

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
    exitHandler();
  });
}

main();

