import { BadRequestException, type PipeTransform } from "@nestjs/common";
import type { ZodType } from "zod";

export class ZodValidationPipe<
  TSchema extends ZodType,
> implements PipeTransform<unknown, TSchema["_output"]> {
  constructor(private readonly schema: TSchema) {}

  transform(value: unknown): TSchema["_output"] {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException({
        message: "입력값을 확인해 주세요.",
        issues: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    return result.data;
  }
}
