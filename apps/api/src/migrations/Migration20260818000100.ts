import { Migration } from "@mikro-orm/migrations";

export class Migration20260818000100 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      "alter table `links` rename column `owner_user_id` to `created_by_user_id`;",
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      "alter table `links` rename column `created_by_user_id` to `owner_user_id`;",
    );
  }
}
