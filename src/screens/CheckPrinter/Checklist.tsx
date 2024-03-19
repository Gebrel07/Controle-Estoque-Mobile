import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { usePrinterInfos } from "../../hooks/usePrinterInfos";
import { AccessoryForCheck } from "../../types/firebaseModels";
import ChecklistItem from "./ChecklistItem";

const Checklist = ({
  printerId,
  onItemChecked,
}: {
  printerId: string;
  onItemChecked: (itemId: string, checked: boolean) => any;
}) => {
  const [isPending, setIsPending] = useState<boolean>();
  const [error, setError] = useState<string | null>(null);

  const [accessories, setAccessories] = useState<AccessoryForCheck[] | null>(null);

  const { getPrinterAccessoryInfos } = usePrinterInfos();

  useEffect(() => {
    getPrinterAccessoryInfos(printerId)
      .then((res) => {
        setAccessories(res);
      })
      .catch((err) => {
        console.error(err);
        setError("Erro ao carregar acessórios");
      })
      .finally(() => setIsPending(false));
  }, []);

  if (isPending) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!accessories?.length) {
    return (
      <View style={styles.container}>
        <Text>Nenhum acessório encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confira os acessórios abaixo</Text>
      <Text>Clique em cada acessório para marca-lo como OK ou Faltante</Text>
      {accessories.map((item) => (
        <ChecklistItem accessory={item} key={item.id} onChecked={onItemChecked} />
      ))}
    </View>
  );
};

export default Checklist;

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
