import { auth } from "@/firebaseConf";
import { NavigationProp } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function LoggedIn({ navigation }: { navigation: any }) {
  const logout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Home");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ margin: 10 }}>
        Has iniciat sessió a{" "}
        {auth.currentUser ? auth.currentUser.email : "unknown"}!
      </Text>
      <Button title="Tancar sessió" onPress={logout} />
    </View>
  );
}

function Signup({
  setScreen,
}: {
  setScreen: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createAccount = async () => {
    try {
      if (password === confirmPassword) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        setError("Les contrassenyes no coincideixen");
      }
    } catch (e) {
      setError(
        `Hi ha hagut un problema en crear el teu compte: ${(e as any).message}`,
      );
    }
  };

  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Text style={styles.header}>Registra't</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity onPress={() => setScreen("login")}>
          <Text style={styles.link}>Inicia sessió a un compte existent</Text>
        </TouchableOpacity>

        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Escriu l'adreça de correu electrònic"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Escriu la contrassenya"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirma la contrassenya"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
          style={styles.input}
        />

        <Button
          title="Crear el compte"
          onPress={createAccount}
          disabled={!email || !password || !confirmPassword}
        />
      </View>
    </View>
  );
}

function Login({
  setScreen,
  navigation,
}: {
  setScreen: React.Dispatch<React.SetStateAction<string | null>>;
  navigation: any;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loginUser = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("MyFilms");
    } catch (error) {
      if (
        (error as any).code === "auth/invalid-email" ||
        (error as any).code === "auth/wrong-password"
      ) {
        setError("El teu correu electrònic o la contrassenya era incorrecta");
      } else if ((error as any).code === "auth/email-already-in-use") {
        setError("Ja existeix un compte amb aquest correu electrònic");
      } else {
        setError("Hi ha hagut un problema amb la teva sol·licitud");
      }
    }
  };

  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Text style={styles.header}>Inicia sessió</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity onPress={() => setScreen("signup")}>
          <Text style={styles.link}>Crea un compte</Text>
        </TouchableOpacity>

        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Entra l'adreça de correu electrònic"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Entra la contrassenya"
          autoCapitalize="none"
          placeholderTextColor="#aaa"
          style={styles.input}
        />

        <TouchableOpacity onPress={() => setScreen("reset-password")}>
          <Text style={[styles.link, { color: "#333" }]}>
            He oblidat la contrassenya
          </Text>
        </TouchableOpacity>

        <Button
          title="Inicia sessió"
          onPress={loginUser}
          disabled={!email || !password}
        />
      </View>
    </View>
  );
}

function ResetPassword({
  setScreen,
}: {
  setScreen: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const resetUserPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setSubmitted(true);
      setError(null);
    } catch (error) {
      if ((error as any).code === "auth/user-not-found") {
        setError("User not found");
      } else {
        setError("There was a problem with your request");
      }
    }
  };

  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Text style={styles.header}>Reiniciar contrassenya</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity onPress={() => setScreen("login")}>
          <Text style={styles.link}>Torna a inici de sessió</Text>
        </TouchableOpacity>

        {submitted ? (
          <Text>
            Si us plau, comprova el correu electrònic per al link de reinici de
            contrassenya.
          </Text>
        ) : (
          <>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="Enter email address"
              autoCapitalize="none"
              placeholderTextColor="#aaa"
              style={styles.input}
            />

            <Button
              title="Reset Password"
              onPress={resetUserPassword}
              disabled={!email}
            />
          </>
        )}
      </View>
    </View>
  );
}

export default function IniciaSessio({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screen, setScreen] = useState<string | null>(null);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  });

  const getScreen = () => {
    if (loggedIn) return <LoggedIn navigation={navigation} />;
    if (screen === "signup") return <Signup setScreen={setScreen} />;
    if (screen === "reset-password")
      return <ResetPassword setScreen={setScreen} />;
    return <Login setScreen={setScreen} navigation={navigation} />;
  };

  return <View style={{ flex: 1 }}>{getScreen()}</View>;
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    width: 240,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  error: {
    marginBottom: 20,
    color: "red",
  },
  link: {
    color: "blue",
    marginBottom: 20,
  },
});
