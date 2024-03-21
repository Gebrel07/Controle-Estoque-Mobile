export const useQueryUtils = () => {
  const leftJoinQueriesOnKey = (
    leftQuery: Array<Record<string, any>>,
    rightQuery: Array<Record<string, any>>,
    leftKey: string,
    rightKey: string
  ) => {
    const res: Array<Record<string, any>> = [];

    for (const leftItem of leftQuery) {
      const rightItem = rightQuery.find((item) => {
        return leftItem[leftKey] === item[rightKey];
      });

      if (!rightItem) {
        throw new Error(`${rightKey}:${leftItem[leftKey]} not found in rightQuery`);
      }

      res.push({ ...leftItem, ...rightItem });
    }

    return res;
  };
  return { leftJoinQueriesOnKey };
};
