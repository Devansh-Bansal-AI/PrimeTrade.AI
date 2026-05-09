import mongoose from "mongoose";
import { connectDatabase } from "../config/db";
import { User } from "../models/User";

const bootstrapAdmin = async (): Promise<void> => {
  const emailArg = process.argv[2]?.trim().toLowerCase();

  if (!emailArg) {
    throw new Error("Email argument is required. Example: npm run bootstrap:admin -- admin@example.com");
  }

  await connectDatabase();
  const user = await User.findOne({ email: emailArg });

  if (!user) {
    throw new Error(`No user found for email: ${emailArg}`);
  }

  if (user.role === "admin") {
    console.log(`User ${emailArg} is already an admin.`);
    return;
  }

  user.role = "admin";
  await user.save();
  console.log(`User ${emailArg} has been promoted to admin.`);
};

bootstrapAdmin()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Failed to bootstrap admin.";
    console.error(message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
