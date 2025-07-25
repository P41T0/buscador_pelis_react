import { app, auth } from "@/firebaseConf";
import { StackNavigationProp } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";

const db = getDatabase(app);

interface FilmItem {
  id: string;
  title: string;
  release_date: string;
  poster_path?: string;
  overview: string;
}

function Item({ item }: { item: FilmItem }) {
  return (
    <View style={{ borderWidth: 1, padding: 5, margin: 5, borderRadius: 5 }}>
      <Text
        style={{
          textAlign: "center",
          fontSize: 25,
          fontWeight: "bold",
          margin: 5,
        }}
      >
        {item.title} ({item.release_date})
      </Text>
      {item.poster_path && (
        <Image
          style={{ alignSelf: "center", width: 200, height: 300 }}
          source={{ uri: "https://image.tmdb.org/t/p/w200" + item.poster_path }}
        />
      )}
      <Text style={{ margin: 15, textAlign: "justify" }}>{item.overview}</Text>
      <Pressable
        style={{
          backgroundColor: "red",
          maxWidth: 300,
          padding: 10,
          alignSelf: "center",
          marginHorizontal: 5,
          marginVertical: 20,
          borderRadius: 5,
          maxHeight: 40,
        }}
        onPress={() => removeFromFavourites(item.id)}
      >
        <Text>Eliminar le pel·lícula de preferits</Text>
      </Pressable>
    </View>
  );
}

function removeFromFavourites(id: string) {
  if (auth.currentUser != null) {
    remove(ref(db, "/" + auth.currentUser.uid + "/films/" + id));
  }
}

function MostraPelis() {
  const [mySavedFilms, setMySavedFilms] = useState({});
  useEffect(() => {
    setMySavedFilms({});
    if (auth.currentUser != null) {
      return onValue(
        ref(db, "/" + auth.currentUser.uid + "/films/"),
        (querySnapShot) => {
          let data = querySnapShot.val() || {};
          let firebaseFilms = { ...data };
          setMySavedFilms(firebaseFilms);
        },
      );
    }
  }, []);
  const myfilmsKeys = Object.keys(mySavedFilms);
  if (auth.currentUser != null) {
    return (
      <>
        <View>
          <Text
            style={{
              alignSelf: "center",
              fontSize: 25,
              fontWeight: "bold",
              margin: 5,
            }}
          >
            Les meves pel·lícules ({auth.currentUser.email})
          </Text>
        </View>
        {myfilmsKeys.length > 0 ? (
          <>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 20,
                fontWeight: "bold",
                margin: 5,
              }}
            >
              Tens un total de {myfilmsKeys.length} pel·lícules guardades
            </Text>
            <FlatList
              data={Object.values(mySavedFilms) as FilmItem[]}
              renderItem={({ item }: { item: FilmItem }) => (
                <Item item={item} />
              )}
              keyExtractor={(item) => item.id}
            />
          </>
        ) : (
          <Text
            style={{ fontSize: 20, fontWeight: "bold", alignSelf: "center" }}
          >
            No hi ha cap pel·lícula guardada!
          </Text>
        )}
      </>
    );
  }
}

// Define RootStackParamList if not imported from elsewhere
type RootStackParamList = {
  MyFilms: undefined;
  IniciaSessio: undefined;
};

type MyFilmsNavigationProp = StackNavigationProp<RootStackParamList, "MyFilms">;

export default function MyFilms({
  navigation,
}: {
  navigation: MyFilmsNavigationProp;
}) {
  const [loggedIn, setLoggedIn] = useState(false);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  });

  if (loggedIn === true) {
    return <MostraPelis />;
  } else {
    return (
      <>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Pressable
            style={{
              backgroundColor: "lightblue",
              maxWidth: "auto",
              alignSelf: "center",
              padding: 10,
              marginHorizontal: 5,
              marginVertical: 20,
              borderRadius: 5,
              maxHeight: "auto",
            }}
            onPress={() => {
              navigation.navigate("IniciaSessio");
            }}
          >
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>
              Si us plau, inicia sessió per a veure les pel·lícules guardades
            </Text>
          </Pressable>
        </View>
      </>
    );
  }
}
