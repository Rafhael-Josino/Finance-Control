import { PG } from '..';

class Migration {
  async up() {
    await PG.query(
        `ALTER TABLE users ADD isAdmin BOOLEAN DEFAULT FALSE;`,
        []
    );
  }

  async down() {
    await PG.query(
      `ALTER TABLE users DROP isAdmin;`,
      []
    );
  }
}

export { Migration }
