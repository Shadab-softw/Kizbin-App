import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,Platform
} from "react-native";
import Voice from "@react-native-voice/voice";
import { Actionsheet, useDisclose } from "native-base";
import { useDispatch, useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import { voiceStart } from "../../redux/reducers/VoiceToText/action";
import animation from "../../assets/lottieAnimation/index";
import { useTranslation } from "react-i18next";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { theme } from "../../theme";
import { Title } from "../Typography";
import { VoiceResultAction } from "../../redux/reducers/VoiceResult/Action";

function VoiceToText(props: any) {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [end, setEnd] = useState("");
  const [started, setStarted] = useState("");
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);
  const [errorSpeech, seterrorSpeech] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclose();
  const voicestart = useSelector((states) => states.VoiceReducer);
  const { t, i18n } = useTranslation();

  let timeout;
  const InitDelay = 3000;
  const ContinueDelay = 150;
  const handleTimeout = () => {
    Platform.OS === "ios"? Voice.stop() :console.log("android")
    
  }

  useEffect(() => {
    if (voicestart === true) {
      handleVoice();
    }
    dispatch(voiceStart(false));
  }, [voicestart]);


  const onSpeechEnd = (e: any) => {
    onClose();
  };
  const onSpeechError = (e: any) => {
    seterrorSpeech(true);
    onOpen();
  };
  const onSpeechResults = (e: any) => {
    setResults(e.value);
  };
  const onSpeechPartialResults = (e: any) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(handleTimeout, ContinueDelay);
    setPartialResults(e.value);
    dispatch(VoiceResultAction(e.value[0]));
  };
  const startRecognizing = async () => {
    try {
      if (t("common:lang") === "English") {
        await Voice.start("en-US").then(() => {
          timeout = setTimeout(handleTimeout, InitDelay);
        });
      }
      if (t("common:lang") === "Española") {
        await Voice.start("es-US").then(() => {
          timeout = setTimeout(handleTimeout, InitDelay);
        });
      }
      setError("");
      setStarted("");
      setResults([]);
      setPartialResults([]);
      dispatch(VoiceResultAction(""));

      setEnd("");
    } catch (e) {
      console.error(e);
    }
  };
  const destroyRecognizer = async () => {
    try {
      await Voice.destroy();
      setError("");
      setStarted("");
      setResults([]);
      setPartialResults([]);
      dispatch(VoiceResultAction(""));

      setEnd("");
    } catch (e) {
      console.error(e);

    }
  };
  useEffect(() => {
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      destroyRecognizer()
    };
  }, []);
  const handleVoice = () => {
    onOpen();
    startRecognizing();
    seterrorSpeech(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content style={{ height: 250 }}>
            {errorSpeech ? (
              <View style={styles.ErororScreenConteoiner}>
                <TouchableOpacity
                  onPress={() => {
                    onClose();
                  }}
                  style={styles.ErororScreen}
                >
                  <FontAwesome size={50} name="microphone-slash" />
                </TouchableOpacity>
                <Title style={styles.ErororScreenText}>
                  {t('common:PLEASE_SPEAK')}
                </Title>
              </View>
            ) : (
              <View>
                <LottieView
                  style={{ width: 180 }}
                  source={animation.RECORDING_VOICE}
                  autoPlay
                  loop
                />
                <View style={{ width: "100%" }}>
                  {partialResults.map((result, index) => {
                    return (
                      <Text key={`partial-result-${index}`}>{result}</Text>
                    );
                  })}
                </View>
              </View>
            )}
          </Actionsheet.Content>
        </Actionsheet>
      </View>
    </SafeAreaView>
  );
}
export default VoiceToText;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  titleText: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonStyle: {
    flex: 1,
    justifyContent: "center",
    marginTop: 15,
    padding: 10,
    backgroundColor: "#8ad24e",
    marginRight: 2,
    marginLeft: 2,
  },
  buttonTextStyle: {
    color: "#fff",
    textAlign: "center",
  },
  horizontalView: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
  },
  textStyle: {
    textAlign: "center",
    padding: 12,
  },
  imageButton: {
    width: 50,
    height: 50,
  },
  textWithSpaceStyle: {
    flex: 1,
    textAlign: "center",
    color: theme.colors.red[100],
  },
  ErororScreen: {
    height: 100,
    width: 100,
    borderRadius: 360,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.gray[100],
  },
  ErororScreenText: {
    color: theme.colors.red[900],
    marginTop: 10,
  },
  ErororScreenConteoiner: {
    alignItems: "center",
    padding: 10,
  },
});
