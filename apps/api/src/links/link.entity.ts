import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";

@Entity({ tableName: "links" })
export class Link {
  @PrimaryKey({ type: "bigint", autoincrement: true })
  id!: number;

  @Property({ type: "string", length: 64, unique: true })
  slug!: string;

  @Property({ type: "string", fieldName: "target_url", length: 2048 })
  targetUrl!: string;

  @Property({
    fieldName: "created_by_user_id",
    type: "bigint",
    defaultRaw: "0",
    unsigned: true,
  })
  createdByUserId = 0;

  @Property({
    fieldName: "created_at",
    type: "datetime",
    columnType: "datetime(3)",
    defaultRaw: "current_timestamp(3)",
    onCreate: () => new Date(),
  })
  createdAt = new Date();

  @Property({
    fieldName: "updated_at",
    type: "datetime",
    columnType: "datetime(3)",
    defaultRaw: "current_timestamp(3)",
    extra: "on update current_timestamp(3)",
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  updatedAt = new Date();
}
