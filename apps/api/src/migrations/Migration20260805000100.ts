import { Migration } from "@mikro-orm/migrations";

export class Migration20260805000100 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      create table \`links\` (
        \`id\` bigint unsigned not null auto_increment primary key,
        \`slug\` varchar(64) not null,
        \`target_url\` varchar(2048) not null,
        \`owner_user_id\` bigint unsigned not null default 0,
        \`created_at\` datetime(3) not null default current_timestamp(3),
        \`updated_at\` datetime(3) not null default current_timestamp(3) on update current_timestamp(3),
        unique key \`links_slug_unique\` (\`slug\`)
      ) default character set utf8mb4 collate utf8mb4_0900_ai_ci;
    `);
  }

  override async down(): Promise<void> {
    this.addSql("drop table if exists `links`;");
  }
}
