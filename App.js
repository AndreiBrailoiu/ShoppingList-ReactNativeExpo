import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';


export default function App() {
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [shopList, setShopList] = useState([]);
  const db = SQLite.openDatabase('prods.db');
  const title = useState('Shopping List');

  useEffect(() => {
    db.transaction(trx => {
      trx.executeSql('create table if not exists products (id integer primary key not null, product text, quantity text);');
    }, errorHandler, updateList)
  }, []);

  const errorHandler = () => {
    alert('query failed');
  }

  const updateList = () => {
    db.transaction(trx => {
      trx.executeSql('select * from products;', [], (_, { rows }) => setShopList(rows._array));
    }, errorHandler, null);
  }

  const saveItem = () => {
    db.transaction(trx => {
      trx.executeSql('insert into products (product, quantity) values (?, ?);', [product, quantity]);
    }, errorHandler, updateList)
  }

  const deleteItem = (id) => {
    db.transaction(trx => {
      trx.executeSql('delete from products where id = ?;', [id]);
    }, errorHandler, updateList)
  }

  const listHeader = () => {
    return (
      <View><Text style={{ color: 'blue', fontSize: 20 }}>Shopping List</Text></View>
    )
  }

  const listSeparator = () => {
    return (
      <View
        style={{ height: 5 }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <TextInput style={{ borderWidth: 1, width: 200 }} placeholder='Product' onChangeText={product => setProduct(product)} />
      <TextInput style={{ borderWidth: 1, width: 200 }} placeholder='Quantity' onChangeText={quantity => setQuantity(quantity)} />
      <Button title='Save' onPress={saveItem} />
      <FlatList
        ListHeaderComponent={listHeader}
        ItemSeparatorComponent={listSeparator}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
          <View style={styles.listcontainer}>
            <Text>{item.product} : {item.quantity} </Text>
            <Text style={{ color: 'red' }} onPress={() => deleteItem(item.id)}>bought</Text>
          </View>}
        data={shopList}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcontainer: {
    flexDirection: 'row',
    backgroundColor: 'lightgray',
    alignItems: 'center'
  },
});
