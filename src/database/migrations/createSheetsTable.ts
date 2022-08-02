import { PG } from '..';

class Migration {
  async up() {
    await PG.query(
      `CREATE TABLE sheets (
        sheet_id char(21) not null unique,
        sheet_name varchar(25) not null,
        created_at timestamp default current_timestamp,
        last_line int,
        user_id char(21),  
        constraint pk_sheets
          primary key (sheet_id),
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
      `DROP TABLE sheets CASCADE;`,
      []
    );
  }
}

export { Migration }
