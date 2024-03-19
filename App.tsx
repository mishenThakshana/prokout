import { StatusBar } from "expo-status-bar";
import React from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { phrases } from "./assets/data/phrases";
import { useKeepAwake } from "expo-keep-awake";
import DeviceInfo from "react-native-device-info";

export default function App() {
  useKeepAwake();
  const [seconds, setSeconds] = React.useState(0);
  const [isActive, setIsActive] = React.useState(false);
  const [currentPhrase, setCurrentPhrase] = React.useState("");

  React.useEffect(() => {
    let interval: any;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggleTimer = () => {
    setCurrentPhrase("Keep pushing, you're doing great!");
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsActive(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  React.useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * phrases.length);
        setCurrentPhrase(phrases[randomIndex]);
      }, 10000);

      return () => clearInterval(interval);
    } else {
      setCurrentPhrase("Paused...");
    }
  }, [phrases, isActive]);

  const calculateResult = () => {
    const minutes = Math.round(seconds / 60);

    const burnedCalories = (minutes * 4.9 * 3.5 * 85) / 200;

    Alert.alert(
      "Results",
      `You've been riding for ${minutes} minutes and burned approximately ${burnedCalories.toFixed(
        2
      )} calories!`,
      [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
        },
      ]
    );

    resetTimer();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.phrase}>{currentPhrase}</Text>
      {isActive ? (
        <Image source={require("./assets/images/bike_riding.gif")} style={styles.img} />
      ) : (
        <Image source={require("./assets/images/bike_paused.png")} style={styles.img} />
      )}

      <Text style={styles.time}>{formatTime(seconds)}</Text>

      <View style={styles.actions}>
        <TouchableOpacity onPress={toggleTimer}>
          <Ionicons name={isActive ? "pause" : "play-outline"} size={60} />
        </TouchableOpacity>

        <TouchableOpacity onPress={calculateResult}>
          <Ionicons name="stop-outline" size={60} />
        </TouchableOpacity>

        <TouchableOpacity onPress={resetTimer}>
          <Ionicons name="refresh-outline" size={60} />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>Built with ❤️ by Mishen</Text>
        <Text style={styles.bottomText}>v{DeviceInfo.getVersion()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  phrase: {
    fontSize: 20,
    fontWeight: "300",
    marginBottom: 10,
    textAlign: "center",
  },
  img: { width: 250, height: 250 },
  time: { fontSize: 60, fontWeight: "bold" },
  actions: { flexDirection: "row", justifyContent: "space-between", gap: 20, marginTop: 20 },
  bottomContainer: {
    position: "absolute",
    bottom: 20,
  },
  bottomText: { fontSize: 14, fontWeight: "bold", textAlign: "center" },
});
