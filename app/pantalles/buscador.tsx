import { app, auth } from "@/firebaseConf";
import { API_KEY, API_URL } from "@env";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, onValue, ref, remove, set } from "firebase/database";
import React, { useEffect } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

console.log(API_KEY);
console.log(API_URL);
const database = getDatabase(app);

function FinestraCerca() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [pelicula, setPelicula] = React.useState("");
  const [nomPelis, setNomPelis] = React.useState<
    { id: number; title: string; release_date: string }[]
  >([]);
  const [error, setError] = React.useState("");
  const [mySavedFilms, setMySavedFilms] = React.useState({});

  useEffect(() => {
    setMySavedFilms({});
    if (auth.currentUser) {
      return onValue(
        ref(database, "/" + auth.currentUser.uid + "/films/"),
        (querySnapShot) => {
          let data = querySnapShot.val() || {};
          let firebaseFilms = { ...data };
          setMySavedFilms(firebaseFilms);
        },
      );
    }
  }, []);

  function IntrodueixPellicula(e: string) {
    e = e.trim();
    setPelicula(e);
  }
  function BuscaPeli() {
    if (pelicula.length > 2) {
      const url =
        API_URL + "=" + encodeURIComponent(pelicula) + "&api_key=" + API_KEY;
      fetch(url)
        .then((r) => r.json())
        .then((result) => {
          if (result && Array.isArray(result.results)) {
            setNomPelis(result.results);

            if (result.results.length > 1) {
              setError("S'han trobat " + result.results.length + " resultats");
            } else if (result.results.length === 1) {
              setError("S'ha trobat 1 resultat");
            } else {
              setError(
                "No s'ha trobat cap resultat! Prova de buscar alguna altra cosa",
              );
            }
          } else {
            setNomPelis([]);
            setError("Error amb la resposta de l'API. Torna-ho a intentar.");
          }
        })
        .catch(() => {
          setNomPelis([]);
          setError("Error de connexió amb l'API.");
        });
    } else {
      setError("S'ha d'escriure un mínim de 3 caràcters");
    }
  }
  function PeliculaBuscada({
    item,
  }: {
    item: { id: number; title: string; release_date: string };
  }) {
    const [loggedIn, setLoggedIn] = React.useState(false);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    if (loggedIn) {
      if (item.id in mySavedFilms) {
        return (
          <View
            style={{ margin: 5, borderRadius: 5, padding: 5, borderWidth: 1 }}
          >
            <Pressable
              onPress={() =>
                navigation.navigate("Detall", { peli: item, guardada: true })
              }
            >
              <Text style={{ fontStyle: "italic" }}>
                Guardada dins les teves pel·lícules preferides
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                {item.title}
              </Text>
              <Text style={{ fontStyle: "italic", fontSize: 15 }}>
                {item.release_date}
              </Text>
            </Pressable>
          </View>
        );
      } else {
        return (
          <View
            style={{ margin: 5, borderRadius: 5, padding: 5, borderWidth: 1 }}
          >
            <Pressable
              onPress={() =>
                navigation.navigate("Detall", { peli: item, guardada: false })
              }
            >
              <Text style={{ fontStyle: "italic" }}>
                No està guardada dins les teves pel·lícules preferides
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                {item.title}
              </Text>
              <Text style={{ fontStyle: "italic", fontSize: 15 }}>
                {item.release_date}
              </Text>
            </Pressable>
          </View>
        );
      }
    } else {
      return (
        <View
          style={{ margin: 5, borderRadius: 5, padding: 5, borderWidth: 1 }}
        >
          <Pressable
            onPress={() => navigation.navigate("Detall", { peli: item })}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              {item.title}
            </Text>
            <Text style={{ fontStyle: "italic", fontSize: 15 }}>
              {item.release_date}
            </Text>
          </Pressable>
        </View>
      );
    }
  }
  function teclaApretada() {
    setError("");
  }

  return (
    <>
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 40, fontWeight: "bold", textAlign: "center" }}>
          Digues la pel·lícula
        </Text>
        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
          <TextInput
            style={{
              fontSize: 15,
              maxWidth: 400,
              backgroundColor: "white",
              borderWidth: 1,
              padding: 5,
              borderRadius: 5,
              margin: 5,
            }}
            onChangeText={IntrodueixPellicula}
            placeholder="Introdueix una pel·lícula"
            onKeyPress={teclaApretada}
            onSubmitEditing={BuscaPeli}
          ></TextInput>
          <Pressable
            style={{
              backgroundColor: "lightblue",
              maxWidth: 280,
              padding: 5,
              margin: 5,
              borderRadius: 5,
              maxHeight: 40,
            }}
            onPress={BuscaPeli}
          >
            <Text style={{ fontSize: 20 }}>Buscar</Text>
          </Pressable>
        </View>
        <Text style={{ marginTop: 60 }}>{error}</Text>
      </View>

      <FlatList
        style={{ margin: 10 }}
        data={nomPelis}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PeliculaBuscada item={item}></PeliculaBuscada>
        )}
      />
    </>
  );
}

function FinestraDetall({
  route,
  navigation,
}: {
  route: any;
  navigation: NavigationProp<RootStackParamList>;
}) {
  const peli = route.params.peli;
  const guardada = route.params.guardada;
  const [loggedIn, setLoggedIn] = React.useState(false);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  });
  function guardaPeli(peli: {
    id: number;
    title: string;
    release_date: string;
    original_language?: string;
    original_title?: string;
    poster_path?: string;
    overview?: string;
    vote_average?: number;
    vote_count?: number;
  }) {
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
    navigation.goBack();
  }
  function removeFromFavourites(id: number) {
    if (auth.currentUser) {
      remove(ref(database, "/" + auth.currentUser.uid + "/films/" + id));
    } else {
      console.error("User is not authenticated");
    }
    navigation.goBack();
  }

  function BotoGuardar({
    pelicula,
    guardada,
  }: {
    pelicula: {
      id: number;
      title: string;
      release_date: string;
      original_language?: string;
      original_title?: string;
      poster_path?: string;
      overview?: string;
      vote_average?: number;
      vote_count?: number;
    };
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
          <Text>Eliminar le pel·lícula de preferits</Text>
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
    if (loggedIn) {
      return (
        <>
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
              {peli && peli.poster_path && (
                <Image
                  style={{ width: 200, height: 300 }}
                  source={{
                    uri: "https://image.tmdb.org/t/p/w200" + peli.poster_path,
                  }}
                ></Image>
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
              Valoració dels usuaris: {peli.vote_average}/10.0 (
              {peli.vote_count} votants)
            </Text>
            <BotoGuardar pelicula={peli} guardada={guardada}></BotoGuardar>
          </ScrollView>
        </>
      );
    } else {
      return (
        <>
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
              {peli && peli.poster_path && (
                <Image
                  style={{ width: 200, height: 300 }}
                  source={{
                    uri: "https://image.tmdb.org/t/p/w200" + peli.poster_path,
                  }}
                ></Image>
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
              Valoració dels usuaris: {peli.vote_average}/10.0 (
              {peli.vote_count} votants)
            </Text>
            <View style={{ alignItems: "center" }}></View>
          </ScrollView>
        </>
      );
    }
  } else {
    return (
      <View>
        <Text>No hi hapeli</Text>
      </View>
    );
  }
}

function UserEmail() {
  if (auth.currentUser != null) {
    return (
      <Text style={{ margin: 10, fontWeight: "bold", fontSize: 15 }}>
        {auth.currentUser.email}
      </Text>
    );
  } else {
    return (
      <Text style={{ margin: 10, fontWeight: "bold", fontSize: 15 }}>
        No hi ha cap sessió iniciada
      </Text>
    );
  }
}

type RootStackParamList = {
  Cerca: undefined;
  Detall: {
    peli: {
      id: number;
      title: string;
      release_date: string;
      original_language?: string;
      original_title?: string;
      poster_path?: string;
      overview?: string;
      vote_average?: number;
      vote_count?: number;
    };
    guardada?: boolean;
  };
};

export default function Buscador() {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cerca"
        component={FinestraCerca}
        options={{ headerRight: () => <UserEmail /> }}
      />
      <Stack.Screen
        name="Detall"
        component={FinestraDetall}
        options={{ headerRight: () => <UserEmail /> }}
      />
    </Stack.Navigator>
  );
}
