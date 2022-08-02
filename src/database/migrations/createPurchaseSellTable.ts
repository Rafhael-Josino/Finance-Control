import { PG } from '..';

class Migration {
  async up() {
    await PG.query(
        `CREATE TABLE purchase_sell (
            purchase_id char(21) references purchases (purchase_id) on delete cascade,
            sell_id char(21) references sells (sell_id) on delete cascade,
            quant_sold real not null,
            constraint purchase_sell_pk
                primary key (purchase_id, sell_id)
        );`,
        []
    );
  }

  async down() {
    await PG.query(
      `DROP TABLE purchase_sell CASCADE;`,
      []
    );
  }
}

export { Migration }
