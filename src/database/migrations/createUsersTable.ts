import { PG } from '..';

class Migration {
  async up() {
    await PG.query(
      `CREATE TABLE users (
        user_id char(21) default nanoid(),
        user_name varchar(50) unique not null,
        created_at timestamp default current_timestamp,
        password varchar,
        constraint pk_users
          primary key (user_id)
      );`,
      []
    );
  }

  async down() {
    await PG.query(
      `DROP TABLE users CASCADE;`,
      []
    );
  }
}

export { Migration }
