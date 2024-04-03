import { addDoc, collection, getDocs, limit, query, where } from "firebase/firestore";
import { projFirestore } from "../firebase/config";

const useUser = () => {
  interface User {
    id: string;
    userId: string;
    displayName: string;
  }

  interface UserDto extends Omit<User, "id"> {}

  const collectionName = "users";

  const addUser = async (userId: string, displayName: string): Promise<string> => {
    const newUser: UserDto = { userId, displayName };

    const docRef = await addDoc(collection(projFirestore, collectionName), newUser);
    return docRef.id;
  };

  const getUserById = async (userId: string): Promise<User | null> => {
    const q = query(
      collection(projFirestore, collectionName),
      where("userId", "==", userId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const firstDoc = querySnapshot.docs[0];

    return {
      id: firstDoc.id,
      userId: firstDoc.get("userId"),
      displayName: firstDoc.get("displayName"),
    };
  };

  return { addUser, getUserById };
};

export default useUser;
