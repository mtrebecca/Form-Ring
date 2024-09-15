import { DataSource } from "typeorm";
import { Ring } from "./models/Ring";
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database/database.sqlite",
  entities: [Ring],
  synchronize: true,
});
