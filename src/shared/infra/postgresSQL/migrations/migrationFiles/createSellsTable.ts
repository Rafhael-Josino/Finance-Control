import { PG } from '../..';

class Migration {
  async up() {
    await PG.query(
        `CREATE TABLE sells (
            sell_id char(21) primary key,
            asset varchar(10) not null,
            sell_date timestamp not null,
            sell_local varchar(20) not null,
            received real not null,
            quant_sold real not null,
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
      `DROP TABLE sells CASCADE;`,
      []
    );
  }
}

export { Migration }
