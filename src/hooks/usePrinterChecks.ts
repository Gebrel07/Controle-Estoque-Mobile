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
import { Address } from "../types/clientTypes";
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
      userId: docSnap.get("userId"),
      printerId: docSnap.get("printerId"),
      serialNumberOk: docSnap.get("serialNumberOk"),
      clientOk: docSnap.get("clientOk"),
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
        userId: doc.get("userId"),
        printerId: doc.get("printerId"),
        serialNumberOk: doc.get("serialNumberOk"),
        clientOk: doc.get("clientOk"),
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

    return {
      id: firstDoc.id,
      userId: firstDoc.get("userId"),
      printerId: firstDoc.get("printerId"),
      serialNumberOk: firstDoc.get("serialNumberOk"),
      clientOk: firstDoc.get("clientOk"),
      note: firstDoc.get("note"),
      date: firstDoc.get("date"),
      completed: firstDoc.get("completed"),
    };
  };

  const addPrinterCheck = async (
    userId: string,
    printerId: string,
    serialNumber: string,
    serialNumberOk: boolean,
    address: Address,
    addressOk: boolean,
    note: string | null = null
  ): Promise<string> => {
    const printerCheck: PrinterCheckDto = {
      userId,
      printerId,
      serialNumber,
      serialNumberOk,
      addressOk,
      address,
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
