import { AppDataSource } from './data-source';
import { app } from './app';
import fs from 'fs';
import path from 'path';

AppDataSource.initialize()
  .then(() => {
    const dbPath = path.resolve(__dirname, '../database');
    if (fs.existsSync(dbPath)) {
      console.log(`Database file created at: ${dbPath}`);
    } else {
      console.log('Database file was not created.');
    }

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  });
