import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

export default function Home() {
  return (
    <ScrollView>
      <Text style={{ fontSize: 40, fontWeight: "bold", textAlign: "center" }}>
        Pel·lícules recomanades
      </Text>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            margin: 10,
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            maxWidth: 400,
          }}
        >
          <Image
            style={{ width: 200, height: 300 }}
            source={{
              uri: "https://image.tmdb.org/t/p/w200/b1xCNnyrPebIc7EWNZIa6jhb1Ww.jpg",
            }}
          />
          <Image
            style={{ width: 200, height: 300 }}
            source={{
              uri: "https://image.tmdb.org/t/p/w200/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
            }}
          />
          <Image
            style={{ width: 200, height: 300 }}
            source={{
              uri: "https://image.tmdb.org/t/p/w200/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
            }}
          />
          <Image
            style={{ width: 200, height: 300 }}
            source={{
              uri: "https://image.tmdb.org/t/p/w200/olxpyq9kJAZ2NU1siLshhhXEPR7.jpg",
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
