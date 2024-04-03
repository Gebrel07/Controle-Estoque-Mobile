import { describe, expect, test } from "@jest/globals";
import { useQueryUtils } from "../src/hooks/useQueryUtils";

describe("leftJoinQueriesOnKey", () => {
  const { leftJoinQueriesOnKey } = useQueryUtils();

  test("joins queries and returns single query", () => {
    const leftQuery = [{ id: 1, a: 123, b: 456 }];
    const rightQuery = [{ id: 1, a: 321, b: 654, c: 987 }];

    expect(leftJoinQueriesOnKey(leftQuery, rightQuery, "id", "id")).toStrictEqual([
      { id: 1, a: 123, b: 456, c: 987 },
    ]);
  });
});
