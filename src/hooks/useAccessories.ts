import { collection, documentId, getDocs, query, where } from "firebase/firestore";
import { projFirestore } from "../firebase/config";
import { Accessory } from "../types/accessoryTypes";

const useAccessories = () => {
  const collectionName = "accessories";

  const queryAccessoriesById = async (accessoriIds: string[]): Promise<Accessory[] | null> => {
    const q = query(
      collection(projFirestore, collectionName),
      where(documentId(), "in", accessoriIds)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const res: Accessory[] = [];
    querySnapshot.forEach((acessory) => {
      res.push({
        id: acessory.id,
        category: acessory.get("category"),
        serialNumber: acessory.get("serialNumber"),
        type: acessory.get("type"),
      });
    });

    return res;
  };

  return { queryAccessoriesById };
};

export default useAccessories;
