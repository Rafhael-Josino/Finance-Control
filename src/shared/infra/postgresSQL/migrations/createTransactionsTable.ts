import { PG } from '..';

class Migration {
  async up() {
    await PG.query(
      `CREATE TABLE transactions (
        transaction_id char(21) not null default nanoid(),
        transaction_description varchar not null,
        transaction_value real,
        transaction_date timestamp,
        user_id char(21),  
        constraint pk_transaction
          primary key (transaction_id),
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
      `DROP TABLE transactions CASCADE;`,
      []
    );
  }
}

export { Migration }
