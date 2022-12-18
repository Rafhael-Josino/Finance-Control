import { hash } from 'bcryptjs';
import { PG } from '../..';

class Migration {
  async up() {
    const passwordHash = await hash('12345', 8);

    /**
     * It is strongly recommended change the password or even this user
     * after the first login with it
     */

    await PG.query(
      `INSERT INTO users (user_name, password, is_admin) VALUES ($1, $2, true);`,
      ["admin", passwordHash]
    );
  }

  async down() {
    await PG.query(
      `'DELETE FROM users WHERE user_name = admin';`,
      []
    );
  }
}

export { Migration }
