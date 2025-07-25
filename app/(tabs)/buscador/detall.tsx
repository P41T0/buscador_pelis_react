import { app, auth } from "@/firebaseConf";
import { useLocalSearchParams, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, remove, set } from "firebase/database";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

export default function FinestraDetall() {
  const database = getDatabase(app);
  const router = useRouter();
  const params = useLocalSearchParams();

  // Si envies l'objecte peli com JSON string, cal parsejar-lo
  const peli = params.peli ? JSON.parse(params.peli as string) : null;
  const guardada = params.guardada === "true";

  const [loggedIn, setLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);

  function guardaPeli(peli: any) {
    if (auth.currentUser) {
      set(
        ref(
          database,
          "/" + auth.currentUser.uid + "/films/" + peli.id.toString(),
        ),
        peli,
      );
    } else {
      console.error("User is not authenticated");
    }
    router.back();
  }

  function removeFromFavourites(id: number) {
    if (auth.currentUser) {
      remove(ref(database, "/" + auth.currentUser.uid + "/films/" + id));
    } else {
      console.error("User is not authenticated");
    }
    router.back();
  }

  function BotoGuardar({
    pelicula,
    guardada,
  }: {
    pelicula: any;
    guardada: boolean;
  }) {
    if (guardada) {
      return (
        <Pressable
          style={{
            backgroundColor: "red",
            alignSelf: "center",
            maxWidth: 300,
            padding: 10,
            marginHorizontal: 5,
            marginVertical: 20,
            borderRadius: 5,
            maxHeight: 40,
          }}
          onPress={() => {
            removeFromFavourites(pelicula.id);
          }}
        >
          <Text>Eliminar la pel·lícula de preferits</Text>
        </Pressable>
      );
    } else {
      return (
        <Pressable
          onPress={() => {
            guardaPeli(pelicula);
          }}
          style={{
            backgroundColor: "lightblue",
            maxWidth: 300,
            alignSelf: "center",
            padding: 10,
            marginHorizontal: 5,
            marginVertical: 20,
            borderRadius: 5,
            maxHeight: 40,
          }}
        >
          <Text>Guardar la pel·lícula a preferits</Text>
        </Pressable>
      );
    }
  }

  if (peli) {
    return (
      <ScrollView>
        <Text
          style={{
            marginHorizontal: 15,
            marginVertical: 5,
            fontSize: 40,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {peli.title}
        </Text>
        <Text
          style={{
            marginHorizontal: 15,
            marginVertical: 10,
            textAlign: "center",
            fontStyle: "italic",
            fontSize: 20,
          }}
        >
          Original title ({peli.original_language}): {peli.original_title}
        </Text>
        <View
          style={{
            marginHorizontal: 15,
            marginVertical: 20,
            alignItems: "center",
          }}
        >
          {peli.poster_path && (
            <Image
              style={{ width: 200, height: 300 }}
              source={{
                uri: "https://image.tmdb.org/t/p/w200" + peli.poster_path,
              }}
            />
          )}
        </View>
        <Text
          style={{
            textAlign: "justify",
            marginHorizontal: 15,
            marginVertical: 5,
          }}
        >
          Descripció: {peli.overview}
        </Text>
        <Text style={{ marginHorizontal: 15, marginVertical: 5 }}>
          Data de llançament: {peli.release_date}
        </Text>
        <Text style={{ marginHorizontal: 15, marginVertical: 5 }}>
          Valoració dels usuaris: {peli.vote_average}/10.0 ({peli.vote_count}{" "}
          votants)
        </Text>
        {loggedIn && <BotoGuardar pelicula={peli} guardada={guardada} />}
      </ScrollView>
    );
  } else {
    return (
      <View>
        <Text>No hi ha peli</Text>
      </View>
    );
  }
}
