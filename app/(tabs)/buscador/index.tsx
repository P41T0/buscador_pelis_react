import { app, auth } from "@/firebaseConf";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import React, { useEffect } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

const API_KEY = Constants.expoConfig?.extra?.API_KEY;
const API_URL = Constants.expoConfig?.extra?.API_URL;
const database = getDatabase(app);

export default function FinestraCerca() {
  const router = useRouter();
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
                router.push({
                  pathname: "/buscador/detall",
                  params: {
                    peliId: item.id, // Passa només id o dades simples
                    guardada: "true", // Els params són strings, cal convertir si cal
                  },
                })
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
                router.push({
                  pathname: "/buscador/detall",
                  params: {
                    peliId: item.id, // Passa només id o dades simples
                    guardada: "false", // Els params són strings, cal convertir si cal
                  },
                })
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
            onPress={() =>
              router.push({
                pathname: "/buscador/detall",
                params: {
                  peliId: item.id, // Passa només id o dades simples
                },
              })
            }
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
