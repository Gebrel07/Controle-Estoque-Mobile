import { Timestamp } from "firebase/firestore";

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

      const aux = { ...leftItem };
      for (const [key, val] of Object.entries(rightItem)) {
        if (!Object.keys(leftItem).includes(key)) {
          aux[key] = val;
        }
      }
      res.push(aux);
    }

    return res;
  };

  const getPropertyList = (objList: Array<{ [key: string]: any }>, propertyName: string): any[] => {
    const res: string[] = [];
    objList.forEach((obj) => {
      res.push(obj[propertyName]);
    });
    return res;
  };

  const timestampToPtBrDateString = (timestamp: Timestamp): string => {
    return timestamp.toDate().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return { leftJoinQueriesOnKey, getPropertyList, timestampToPtBrDateString };
};
