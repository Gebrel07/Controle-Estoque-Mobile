import { collection, documentId, getDocs, limit, query, where } from "firebase/firestore";
import { projFirestore } from "../firebase/config";
import { Accessory, AccessoryForCheck, Printer, PrinterAccessory } from "../types/firebaseModels";

export const usePrinterInfos = () => {
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
    };
  };

  const queryPrinterAccessories = async (printerId: string): Promise<PrinterAccessory[] | null> => {
    const q = query(
      collection(projFirestore, "printerAccessories"),
      where("printerId", "==", printerId)
    );
    const querySnapshot = await getDocs(q);

    // return null if none found
    if (querySnapshot.empty) {
      return null;
    }

    const res: PrinterAccessory[] = [];
    querySnapshot.forEach((doc) => {
      res.push({
        accessoryId: doc.get("accessoryId"),
        hasAccessory: doc.get("hasAccessory"),
        printerId: doc.get("printerId"),
      });
    });

    return res;
  };

  const queryAccessoriesByIds = async (accessoryIds: string[]): Promise<Accessory[] | null> => {
    const q = query(
      collection(projFirestore, "accessories"),
      where(documentId(), "in", accessoryIds)
    );
    const querySnapshot = await getDocs(q);
    // if no infos return null

    if (querySnapshot.empty) {
      return null;
    }

    const res: Accessory[] = [];
    querySnapshot.forEach((doc) => {
      res.push({
        id: doc.id,
        category: doc.get("category"),
        serialNumber: doc.get("serialNumber"),
        type: doc.get("type"),
      });
    });

    return res;
  };

  const getPropertyList = (
    objList: Array<{ [key: string]: any }>,
    propertyName: string
  ): string[] => {
    const res: string[] = [];
    objList.forEach((obj) => {
      res.push(obj[propertyName]);
    });
    return res;
  };

  const joinHasAccessory = (
    accessories: Accessory[],
    printerAccessories: PrinterAccessory[]
  ): AccessoryForCheck[] => {
    const res: AccessoryForCheck[] = [];
    accessories.forEach((accessory) => {
      // find corresponding printerAccessory by id
      const printerAccessory = printerAccessories.find((queryItem) => {
        return accessory.id === queryItem.accessoryId;
      });

      if (!printerAccessory) {
        throw new Error("printerAccessory not found in list");
      }

      // include hasAccessory field
      res.push({ ...accessory, hasAccessory: printerAccessory.hasAccessory });
    });
    return res;
  };

  const getPrinterAccessoryInfos = async (
    printerId: string
  ): Promise<AccessoryForCheck[] | null> => {
    // get printer vs accessories junction
    const printerAccessories = await queryPrinterAccessories(printerId);

    if (printerAccessories === null) {
      return null;
    }

    // get accessory data
    const accessoryIds = getPropertyList(printerAccessories, "accessoryId");
    const accessories = await queryAccessoriesByIds(accessoryIds);

    if (accessories === null) {
      throw new Error("accessories not found in database");
    }

    if (accessories.length !== printerAccessories.length) {
      throw new Error(
        "number of accessories does not match number of printerAccessories in database"
      );
    }

    return joinHasAccessory(accessories, printerAccessories);
  };

  return { queryPrinterBySN, getPrinterAccessoryInfos };
};
