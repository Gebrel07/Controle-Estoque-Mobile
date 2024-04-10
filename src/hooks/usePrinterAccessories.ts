import { collection, getDocs, query, where } from "firebase/firestore";
import { projFirestore } from "../firebase/config";
import { PrinterAccessory } from "../types/accessoryTypes";

const usePrinterAccessories = () => {
  const collectionName = "printerAccessories";

  const queryPrinterAccessories = async (printerId: string): Promise<PrinterAccessory[] | null> => {
    const q = query(collection(projFirestore, collectionName), where("printerId", "==", printerId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const res: PrinterAccessory[] = [];
    querySnapshot.forEach((doc) => {
      res.push({
        id: doc.id,
        accessoryId: doc.get("accessoryId"),
        printerId: doc.get("printerId"),
      });
    });

    return res;
  };

  return { queryPrinterAccessories };
};

export default usePrinterAccessories;
