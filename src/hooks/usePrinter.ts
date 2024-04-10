import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { projFirestore } from "../firebase/config";
import { Printer } from "../types/printerTypes";

export const usePrinter = () => {
  const queryPrinterBySN = async (serialNumber: string): Promise<Printer | null> => {
    const q = query(
      collection(projFirestore, "printers"),
      where("serialNumber", "==", serialNumber),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    // if no printer return null
    if (querySnapshot.empty) {
      return null;
    }

    // get first document in query
    const doc = querySnapshot.docs[0];

    return {
      id: doc.id,
      imgUrl: doc.get("imgUrl"),
      model: doc.get("model"),
      serialNumber: doc.get("serialNumber"),
      clientId: doc.get("clientId"),
    };
  };

  return { queryPrinterBySN };
};
