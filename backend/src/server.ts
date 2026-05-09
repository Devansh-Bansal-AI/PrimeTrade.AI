import app from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";

const bootstrap = async (): Promise<void> => {
  await connectDatabase();
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

bootstrap().catch((error: unknown) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
