import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { projFirestore } from "../firebase/config";
import {
  CheckedAccessory,
  PrinterCheckAccessory,
  PrinterCheckAccessoryDto,
} from "../types/accessoryTypes";
import useAccessories from "./useAccessories";
import usePrinterAccessories from "./usePrinterAccessories";
import { useQueryUtils } from "./useQueryUtils";

export const useCheckAccessories = () => {
  const { leftJoinQueriesOnKey, getPropertyList } = useQueryUtils();
  const { queryAccessoriesById } = useAccessories();
  const { queryPrinterAccessories } = usePrinterAccessories();

  const queryCheckAccessoriesByCheckId = async (
    printerCheckId: string
  ): Promise<PrinterCheckAccessory[] | null> => {
    const q = query(
      collection(projFirestore, "printerCheckAccessories"),
      where("printerCheckId", "==", printerCheckId)
    );
    const querySnapshot = await getDocs(q);

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

  const getCheckedAccessories = async (
    printerCheckId: string
  ): Promise<CheckedAccessory[] | null> => {
    const checkAccessories = await queryCheckAccessoriesByCheckId(printerCheckId);

    if (checkAccessories === null) {
      return null;
    }

    const accessoryIds: string[] = [];
    checkAccessories.forEach((element) => {
      accessoryIds.push(element.accessoryId);
    });

    const accessoriesData = await queryAccessoriesById(accessoryIds);

    if (accessoriesData === null) {
      throw new Error("accessoriesData not found in database");
    }

    if (accessoriesData.length < checkAccessories.length) {
      throw new Error("number of items in accessoryData is smaller than checkAccessories");
    }

    const res: any = leftJoinQueriesOnKey(checkAccessories, accessoriesData, "accessoryId", "id");

    return res;
  };

  const getAccessoriesForCheck = async (printerId: string): Promise<CheckedAccessory[] | null> => {
    // get printer vs accessories junction
    const printerAccessories = await queryPrinterAccessories(printerId);

    if (printerAccessories === null) {
      return null;
    }

    // get accessory data
    const accessoryIds = getPropertyList(printerAccessories, "accessoryId");
    const accessories = await queryAccessoriesById(accessoryIds);

    if (accessories === null) {
      throw new Error("accessories not found in database");
    }

    if (accessories.length !== printerAccessories.length) {
      throw new Error(
        "number of accessories does not match number of printerAccessories in database"
      );
    }

    const joinedQueries = leftJoinQueriesOnKey(accessories, printerAccessories, "id", "accessoryId");

    // add hasAccessory flag
    const res: CheckedAccessory[] = [];
    joinedQueries.forEach((accessory) => {
      res.push({
        id: accessory.accessoryId,
        category: accessory.category,
        serialNumber: accessory.serialNumber,
        type: accessory.type,
        hasAccessory: false,
      });
    });

    return res;
  };

  return {
    queryCheckAccessoriesByCheckId,
    getCheckedAccessories,
    queryPrinterAccessories,
    getAccessoriesForCheck,
    addCheckAccessory,
  };
};
