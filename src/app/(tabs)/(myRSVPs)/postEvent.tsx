import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { Link } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Calendar } from "react-native-calendars";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function PostEvent() {
  // Scroll + input refs
  const scrollRef = useRef<ScrollView>(null);
  const addressRef = useRef<View>(null);
  const maxVolunteersRef = useRef<View>(null);

  const [date, setDate] = useState<string | null>(null);
  const [openDate, setOpenDate] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [openTime, setOpenTime] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // Listen for keyboard open/close
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardOpen(true);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardOpen(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatTime(date: Date | null) {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // Scroll smoothly to any input ref
  const scrollToRef = (ref: any) => {
    setTimeout(() => {
      if (!ref.current || !scrollRef.current) return;

      ref.current.measureLayout(
        scrollRef.current as any,
        (x: number, y: number) => {
          scrollRef.current?.scrollTo({
            y: y - 20,
            animated: true,
          });
        },
        () => {}
      );
    }, 250);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Create an Event</Text>
      </View>

      {/* Keyboard Handling */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 0}
      >
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={false}
          contentContainerStyle={{
            paddingBottom: keyboardOpen ? 20 : 160,
          }}
        >
          <View style={styles.container}>
            {/* Event Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.text}>Event Name</Text>
              <TextInput
                placeholder="Enter event name"
                placeholderTextColor="#B0B0B0"
                style={styles.prettyInput}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>

            {/* Description */}
            <View style={styles.fieldContainer}>
              <Text style={styles.text}>Description</Text>
              <TextInput
                placeholder="Enter a description"
                placeholderTextColor="#B0B0B0"
                style={[styles.prettyInput, { height: 90 }]}
                multiline
                textAlignVertical="top"
                blurOnSubmit={true}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>

            {/* Tags */}
            <View style={styles.fieldContainer}>
              <Text style={styles.text}>Tag/s</Text>
              <TextInput
                placeholder="Enter tags"
                placeholderTextColor="#B0B0B0"
                style={styles.prettyInput}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>

            {/* DATE */}
            <View style={styles.fieldContainer}>
              <Text style={styles.text}>Date</Text>
              <Pressable onPress={() => setOpenDate(true)}>
                <View pointerEvents="none">
                  <TextInput
                    placeholder="Enter a date"
                    placeholderTextColor="#B0B0B0"
                    value={date ? formatDate(date) : ""}
                    style={styles.prettyInput}
                    editable={false}
                  />
                </View>
              </Pressable>
            </View>

            {/* DATE MODAL */}
            <Modal visible={openDate} transparent animationType="slide">
              <View style={styles.modalContainer}>
                <Pressable 
                  style={styles.backdrop} 
                  onPress={() => setOpenDate(false)}
                />
                <View style={styles.modalBox}>
                  <Pressable
                    style={styles.closeCircle}
                    onPress={() => setOpenDate(false)}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "700" }}>X</Text>
                  </Pressable>

                  <View style={{ height: 400, marginTop: 25 }}>
                    <Calendar
                      onDayPress={(day) => {
                        setDate(day.dateString);
                        setOpenDate(false);
                      }}
                      markedDates={{
                        [date || ""]: { selected: true, selectedColor: "#588157" },
                      }}
                    />
                  </View>
                </View>
              </View>
            </Modal>

            {/* TIME */}
            <View style={styles.fieldContainer}>
              <Text style={styles.text}>Time</Text>
              <Pressable onPress={() => setOpenTime(true)}>
                <View pointerEvents="none">
                  <TextInput
                    placeholder="Enter a time"
                    placeholderTextColor="#B0B0B0"
                    value={time ? formatTime(time) : ""}
                    style={styles.prettyInput}
                    editable={false}
                  />
                </View>
              </Pressable>
            </View>

            <DateTimePickerModal
              isVisible={openTime}
              mode="time"
              date={time || new Date()}
              onConfirm={(selected) => {
                setTime(selected);
                setOpenTime(false);
              }}
              onCancel={() => setOpenTime(false)}
            />

            {/* ADDRESS */}
            <View ref={addressRef} style={styles.fieldContainer}>
              <Text style={styles.text}>Address</Text>
              <TextInput
                placeholder="Enter full street address (123 Main St, City, State)"
                placeholderTextColor="#B0B0B0"
                style={[styles.prettyInput, { height: 100 }]}
                multiline
                textAlignVertical="top"
                onFocus={() => scrollToRef(addressRef)}
                blurOnSubmit={true}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>

            {/* MAX VOLUNTEERS */}
            <View ref={maxVolunteersRef} style={styles.fieldContainer}>
              <Text style={styles.text}>Maximum Volunteers</Text>
              <TextInput
                placeholder="Enter maximum number of volunteers"
                placeholderTextColor="#B0B0B0"
                style={styles.prettyInput}
                keyboardType="numeric"
                onFocus={() => scrollToRef(maxVolunteersRef)}
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
            </View>

            {/* BUTTONS */}
            <View style={styles.buttonContainer}>
              <Pressable style={styles.postButton}>
                <Text style={styles.postButtonText}>Post</Text>
              </Pressable>

              <Pressable style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete Event</Text>
              </Pressable>
            </View>
          </View>

          {/* BACK LINK */}
          <Link
            href="/(tabs)/(myRSVPs)/myRSVPs"
            style={{
              marginTop: 30,
              marginLeft: 20,
              color: "#588157",
              fontWeight: "600",
            }}
          >
            ← Back to My RSVPs
          </Link>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#588157",
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "500",
    color: "white",
    marginTop: 15
  },
  container: {
    marginHorizontal: 20,
    marginTop: 40,
    gap: 20,
  },
  fieldContainer: {
    gap: 8,
  },
  text: {
    fontSize: 19,
    fontWeight: "500",
  },
  prettyInput: {
    backgroundColor: "#fffafa",
    borderWidth: 1,
    borderColor: "#b7b7b7",
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeCircle: {
    position: "absolute",
    top: -25,
    right: 15,
    zIndex: 20,
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },

  /* BUTTONS */
  buttonContainer: {
    marginTop: 10,
    gap: 15,
  },
  postButton: {
    backgroundColor: "#00A400",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  postButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});