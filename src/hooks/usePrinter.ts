import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { projFirestore } from "../firebase/config";
import { Printer } from "../types/printerTypes";
import { PrinterData } from "../types/resultTypes";
import { useCheckAccessories } from "./useCheckAccessories";
import useClient from "./useClient";
import { usePrinterChecks } from "./usePrinterChecks";
import useUser from "./useUser";

export const usePrinter = () => {
  const { queryClientById } = useClient();
  const { queryLastPrinterCheck } = usePrinterChecks();
  const { getCheckedAccessories } = useCheckAccessories();
  const { getUserById } = useUser();

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

  const getPrinterDataBySerialNumber = async (serialNumber: string) => {
    const printer = await queryPrinterBySN(serialNumber);
    if (!printer) {
      return null;
    }

    const client = await queryClientById(printer.clientId);
    if (!client) {
      throw new Error("Printer`s client was not found");
    }

    const res: PrinterData = {
      printer: printer,
      client: client,
      lastCheck: null,
    };

    const lastCheck = await queryLastPrinterCheck(printer.id);
    if (lastCheck) {
      const accessories = await getCheckedAccessories(lastCheck.id);
      const user = await getUserById(lastCheck.userId);

      if (!user) {
        throw new Error("User who created PrinterCheck was not found");
      }

      res.lastCheck = {
        printerCheck: lastCheck,
        accessories: accessories,
        user: user,
      };
    }

    return res;
  };

  return { queryPrinterBySN, getPrinterDataBySerialNumber };
};
