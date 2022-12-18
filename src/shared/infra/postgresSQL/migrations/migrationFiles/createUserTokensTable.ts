import { PG } from '../..';

class Migration {
  async up() {
    await PG.query(
      `CREATE TABLE user_tokens (
        user_token_id char(21) default nanoid(),
        refresh_token varchar,
        created_at timestamp default current_timestamp,
        expires_date timestamp,
        user_id char(21),
        constraint pk_tokens
          primary key (user_token_id),
        constraint fk_users
          foreign key (user_id)
            references users (user_id)
            on delete cascade
      );`,
      []
    );
  }

  async down() {
    await PG.query(
      `DROP TABLE user_tokens CASCADE;`,
      []
    );
  }
}

export { Migration }
