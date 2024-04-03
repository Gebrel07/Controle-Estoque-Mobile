import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { projFirestore } from "../firebase/config";
import { PrinterCheck, PrinterCheckDto } from "../types/printerTypes";

export const usePrinterChecks = () => {
  const queryCheckById = async (checkId: string): Promise<PrinterCheck | null> => {
    const docRef = doc(projFirestore, "printerChecks", checkId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      printerId: docSnap.get("printerId"),
      note: docSnap.get("note"),
      date: docSnap.get("date"),
      completed: docSnap.get("completed"),
    };
  };

  const queryChecksByPrinterId = async (
    printerId: string,
    completed?: boolean
  ): Promise<PrinterCheck[] | null> => {
    const filters = [where("printerId", "==", printerId)];

    if (typeof completed !== "undefined") {
      filters.push(where("completed", "==", completed));
    }

    const q = query(collection(projFirestore, "printerChecks"), ...filters, orderBy("date", "desc"));
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

  const queryLastPrinterCheck = async (printerId: string): Promise<PrinterCheck | null> => {
    const q = query(
      collection(projFirestore, "printerChecks"),
      where("printerId", "==", printerId),
      where("completed", "==", true),
      orderBy("date", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    // if no result return null
    if (querySnapshot.empty) {
      return null;
    }

    // ge first document in query
    const firstDoc = querySnapshot.docs[0];

    const res = {
      id: firstDoc.id,
      printerId: firstDoc.get("printerId"),
      note: firstDoc.get("note"),
      date: firstDoc.get("date"),
      completed: firstDoc.get("completed"),
    };

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

  const completePrinterCheck = async (checkId: string) => {
    const docRef = doc(projFirestore, "printerChecks", checkId);
    // update field
    await updateDoc(docRef, { completed: true });
  };

  return {
    queryChecksByPrinterId,
    queryLastPrinterCheck,
    addPrinterCheck,
    completePrinterCheck,
    queryCheckById,
  };
};
