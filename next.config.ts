import type { NextConfig } from "next";
import { connect } from "./src/dbConfig/dbConfig";

const nextConfig: NextConfig = {};

(async () => {
  try {
    await connect();
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
})();
export default nextConfig;
