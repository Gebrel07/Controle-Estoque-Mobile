import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { projFirestore } from "../firebase/config";
import {
  PrinterCheck,
  PrinterCheckAccessory,
  PrinterCheckAccessoryDto,
  PrinterCheckDto,
} from "../types/firebaseModels";

export const usePrinterChecks = () => {
  const queryChecksByPrinterId = async (printerId: string): Promise<PrinterCheck[] | null> => {
    const q = query(
      collection(projFirestore, "printerChecks"),
      where("printerId", "==", printerId),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);

    // if no result return null
    if (querySnapshot.empty) {
      return null;
    }

    const res: PrinterCheck[] = [];
    querySnapshot.forEach((doc) => {
      res.push({
        id: doc.id,
        printerId: doc.get("printerId"),
        note: doc.get("note"),
        date: doc.get("date"),
        completed: doc.get("completed"),
      });
    });

    return res;
  };

  const queryCheckAccessoriesByCheckId = async (
    printerCheckId: string
  ): Promise<PrinterCheckAccessory[] | null> => {
    const q = query(
      collection(projFirestore, "printerCheckAccessories"),
      where("printerCheckId", "==", printerCheckId)
    );
    const querySnapshot = await getDocs(q);

    // return null if none found
    if (querySnapshot.empty) {
      return null;
    }

    const res: PrinterCheckAccessory[] = [];
    querySnapshot.forEach((doc) => {
      res.push({
        id: doc.id,
        accessoryId: doc.get("accessoryId"),
        hasAccessory: doc.get("hasAccessory"),
        printerCheckId: doc.get("printerCheckId"),
      });
    });

    return res;
  };

  const addPrinterCheck = async (printerId: string, note: string | null = null): Promise<string> => {
    const printerCheck: PrinterCheckDto = {
      printerId,
      note,
      date: Timestamp.fromDate(new Date()),
      completed: false,
    };

    // add document to firebase
    const docRef = await addDoc(collection(projFirestore, "printerChecks"), printerCheck);
    return docRef.id;
  };

  const addCheckAccessory = async (
    accessoryId: string,
    hasAccessory: boolean,
    printerCheckId: string
  ): Promise<string> => {
    const checkAccessory: PrinterCheckAccessoryDto = {
      accessoryId,
      hasAccessory,
      printerCheckId,
    };

    // add to firebase
    const docRef = await addDoc(
      collection(projFirestore, "printerCheckAccessories"),
      checkAccessory
    );
    return docRef.id;
  };

  const completePrinterCheck = async (checkId: string) => {
    const docRef = doc(projFirestore, "printerChecks", checkId);
    // update field
    await updateDoc(docRef, { completed: true });
  };

  return {
    queryChecksByPrinterId,
    queryCheckAccessoriesByCheckId,
    addPrinterCheck,
    addCheckAccessory,
    completePrinterCheck,
  };
};
