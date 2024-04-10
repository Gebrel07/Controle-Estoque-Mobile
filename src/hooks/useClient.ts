import { doc, getDoc } from "firebase/firestore";
import { projFirestore } from "../firebase/config";
import { Client } from "../types/clientTypes";

const useClient = () => {
  const collectionName = "clients";

  const queryClientById = async (clientId: string): Promise<Client | null> => {
    const docRef = doc(projFirestore, collectionName, clientId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      name: docSnap.get("name"),
      address: {
        street: docSnap.get("address.street"),
        number: docSnap.get("address.number"),
        city: docSnap.get("address.city"),
        state: docSnap.get("address.state"),
        zipCode: docSnap.get("address.zipCode"),
      },
    };
  };

  return { queryClientById };
};

export default useClient;
