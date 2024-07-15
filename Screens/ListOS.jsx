import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  Checkbox,
  List,
  Button,
  Portal,
  Provider as PaperProvider,
  Icon,
} from "react-native-paper";
import NewTask from "./NewTask";

export default function ListOS() {
  const [data, setData] = useState([
    {
      id: 1,
      title: "First Item",
      status: false,
    },
    {
      id: 2,
      title: "aaaaaa",
      status: false,
    },
    {
      id: 3,
      title: "Third Item",
      status: false,
    },
  ]);
  const [id, setId] = useState(4);
  const [title, setTitle] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  function updateData(id, status) {
    const updatedData = data.map((item) =>
      item.id === id ? { ...item, status: status } : item
    );
    setData(updatedData);
  }

  function addItem(a, b, c) {
    setId(id + 1);
    const newOb = {
      id: a,
      title: b,
      status: c,
    };
    setData([...data, newOb]);
    setTitle("");
    hideModal();
  }
  function deleteSelectedItems() {
    const newData = data.filter((item) => !selectedItems.includes(item.id));
    setData(newData);
    setSelectedItems([]);
  }

  const hideModal = () => {
    setVisible(false)
    setTitle("")
  };

  const renderDeleteButton = () => {
    if (selectedItems.length > 0) {
      return (
        <View style={{ alignItems: "flex-start", position: "absolute", bottom: 10, left: 10 }}>
          <Button mode="contained" onPress={deleteSelectedItems}>
            <Icon source={"delete"} size={24} color="white"></Icon>
          </Button>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <NewTask
        visible={visible}
        hideModal={hideModal}
        id={id}
        title={title}
        setTitle={setTitle}
        addItem={addItem}
      />
      <FlatList
        style={styles.listContainer}
        data={data}
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            description="Item description"
            onPress={() => {
              if (selectedItems.includes(item.id)) {
                updateData(item.id, !item.status);
                const newSelectedItems = selectedItems.filter(
                  (selectedId) => selectedId !== item.id
                );
                setSelectedItems(newSelectedItems);
              } else {
                updateData(item.id, !item.status);
                setSelectedItems([...selectedItems, item.id]);
              }
            }}
            left={(props) => (
              <Checkbox status={item.status ? "checked" : "unchecked"} />
            )}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
      {renderDeleteButton()}
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
    marginHorizontal: 10,
  },
  buttonPos: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
