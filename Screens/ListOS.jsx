import React, { useState } from "react";
import { FlatList, StyleSheet, View,Text } from "react-native";
import { List,Button, Provider as PaperProvider,Icon} from "react-native-paper";
import {  Divider } from "react-native-paper";
import NewTask from "./NewTask";

export default function ListOS() {
  const [data, setData] = useState([
    {
      id: 1,
      titleOs: "Trocar a rebimboca da parafuseta",
      description: "",
      client: "Joãozinho da Silva",
      createdAt: new Date(),
    },
    {
      id: 2,
      titleOs: "Second Item",
      description: "Item description",
      client: "Zé das Couves",
      createdAt: new Date(),
    },
    {
      id: 3,
      titleOs: "Third Item",
      description: "Item description",
      client: "Rogerinho do Ingá",
      createdAt: new Date(),
    },
    
  ]);
  const [id, setId] = useState(4);
  const [title, setTitle] = useState("");
  const [visible, setVisible] = useState(false);


  function addItem(a, b, c) {
    const today = new Date();

    setId(prevId => prevId + 1);

    const newOb = {
        id: id, 
        client: a,
        titleOs: b,
        description: c,
        createdAt: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    };
    setData(prevData => [...prevData, newOb]);
    hideModal();
};

  const hideModal = () => {
    setVisible(false)
  };
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <NewTask
        visible={visible}
        hideModal={hideModal}
        setTitle={setTitle}
        addItem={addItem}
      />
       <FlatList
          style={styles.listContainer}
          data={data}
          renderItem={({ item }) => (
            <View>
              <List.Item
                title={item.titleOs}
                description={
                  <View>
                    <Text style={styles.descriptionText}>{item.client || "Cliente não disponível"}</Text>
                    <Text style={styles.dateText}>
                      {item.createdAt ? formatDate(item.createdAt) : "Data não disponível"}
                    </Text>
                  </View>
                }
                onPress={() => console.log(item)}
                left={props => <List.Icon {...props} icon="archive" />} 
                style={styles.listItem}
              />
              <Divider />
            </View>
          )}
          keyExtractor={item => item.id.toString()}
        />
      <View style={styles.buttonPos}>
        <Button mode="contained" onPress={() => setVisible(true)}>
          <Icon source={"plus"} size={24} color="white"></Icon>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  listContainer: {
    padding: 10,
  },
  buttonPos: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  listItem: {
    backgroundColor: "#fff",
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
  },
  descriptionText: {
    fontSize: 14,
    color: "#333",
  },
  dateText: {
    fontSize: 12,
    color: "#888",
  },
});
