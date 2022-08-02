import { PG } from '..';

class Migration {
  async up() {
    await PG.query(
        `CREATE TABLE purchases (
            purchase_id char(21) primary key,
            asset varchar(10) not null,
            purchase_date date not null,
            purchase_local varchar(20) not null,
            total_bought real not null,
            purchase_medium_price real not null,
            tax real,
            remain_quant real,
            new_medium_price real not null,
            sheet_id char(21),
            constraint fk_sheet
            foreign key (sheet_id)
                references sheets (sheet_id)
                on delete cascade
        );`,
        []
    );
  }

  async down() {
    await PG.query(
      `DROP TABLE purchases CASCADE;`,
      []
    );
  }
}

export { Migration }
