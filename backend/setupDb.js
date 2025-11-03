const createTables = require('./createTables');
const migrateData = require('./migrateData');

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    await createTables();
    await migrateData();
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
