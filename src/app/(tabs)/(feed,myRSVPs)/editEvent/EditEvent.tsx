import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Calendar } from "react-native-calendars";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import GVArea from "@components/GVArea";
import { BUTTON_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from "@constants/colors";
import React from "react";
import supabase, { Organization } from "@utils/requests";
import DropDownPicker from 'react-native-dropdown-picker';
import { HelperText, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";

export default function PostEvent() {
  const router = useRouter();
  const [categoryList, setCategoryList] = useState<{ label: string; value: number }[]>([]);

  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const {
      id,
      name,
      description,
      categoryName,
      timestampz,
      publicImageURL,
      maxVolunteers,
      city,
      state
    } = useLocalSearchParams();


  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [categoryID, setCategoryID] = useState(11);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);

  const [image, setImage] = useState<ImagePickerAsset | string | null>();

  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [formError, setFormError] = useState(false);

  const formatDate =(d: Date) => {
    const formattedDate = d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return formattedDate;
  }

  const formatTime = (date: Date | null) => {
    if (!date) return "";
    const formattedDate = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    return formattedDate;
  }

  const fetchCategories = async () => {

    console.log('[PostEvent] fetching categories');
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.log('[PostEvent] error: fetching categories', error);
      return;
    }

    console.log('[PostEvent] fetching categories successful');

    const categoryList = data.map((t) => (
      {
        label: t.name,
        value: t.id
      }
    ))

    const cID = categoryList.find( (e) => (e.label === categoryName))?.value;
    setCategoryID(cID);

    setCategoryList(categoryList);
  }

  const pickImage = async () => {
    console.log('[PostEvent] user initiated local image upload');
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1
    });

    if (result.canceled) {
      console.log('[PostEvent] user canceled image upload');
    } else {
      setImage(result.assets[0]);
      console.log("[PostEvent] image uploaded locally: ", result);
    }
  };

  const init = async () => {
    await fetchCategories();
    setNewName(name as string);
    setNewDescription(description as string);
    const d = new Date(timestampz as string);
    setDate(d);
    setTime(d);
    setImage(publicImageURL ? publicImageURL as string : null);
  }
  useEffect(() => {
    init();
  }, []);

  const validateForm = (): boolean => {
    const nameValid = Boolean(name);
    setNameError(!nameValid);

    const descriptionValid = Boolean(description);
    setDescriptionError(!descriptionValid);

    const dateValid = date !== null;
    const timeValid = time !== null;
    let timestampz: Date | null = null;
    if (dateValid && timeValid) {
      timestampz = new Date(date);
      timestampz.setHours(
        time.getHours(),
        time.getMinutes(),
      );
    }

    const timestampzValid = (timestampz !== null && timestampz.getTime() > Date.now());
    setDateError(!dateValid || !timestampzValid)
    setTimeError(!timeValid || !timestampzValid);

    return (nameValid && descriptionValid && timestampzValid);
  }

  const createTimestampz = (): string => {
    if (date && time) {
      const t = new Date(date);
        t.setHours(
          time.getHours(),
          time.getMinutes(),
        );
        return t.toString();
    }
    return '';
  }

  const handlePostEvent = async () => {
    if (!validateForm()) {
      setFormError(true);
      return;
    }

    const timestampz = createTimestampz();


    const category = categoryList.find( (x) => x.value === categoryID);
    const categoryName = category?.label;

    setFormError(false);
    router.push({
      pathname: '/editEvent/ConfirmEdit',
      params: {
        id: id,
        name: newName,
        description: newDescription,
        categoryID: categoryID,
        categoryName: categoryName,
        maxVolunteers: maxVolunteers,
        timestampz: timestampz,
        city: city,
        state: state,
        imageFileName: (typeof image === 'string' || image === null) ? null : image?.fileName,
        imageURI: (image === null) ? null : 
          ( (typeof image === 'string') ? image : image?.uri )
      }
    })
  }


  const categoryDropDown = (
    <View style={{ zIndex: 1000, elevation: 1000 }}>
      <DropDownPicker
        open={showDropDown}
        value={categoryID}
        items={categoryList}
        setOpen={() => setShowDropDown(!showDropDown)}
        setValue={setCategoryID}
        placeholder="Select an option"
        searchable={true}
        listMode="SCROLLVIEW" // or 'SCROLLVIEW' / 'FLATLIST'
        style={styles.prettyInput}
        dropDownContainerStyle={{
          borderColor: "#b7b7b7"
        }}
      />
    </View>

  );

  const imagePicker = (
    <View
      style={{
        display: 'flex',
        borderRadius: 5,
        width: 240,
        height: 135,
        backgroundColor: "rgba(254, 251, 254, 1)",
        borderWidth: 1,
        borderColor: "rgba(136, 133, 141, 1)",
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        overflow: 'hidden'
      }}
    >
      {(image && image !== null) ?
        (
          <Image
            source={ (typeof image === 'string') ? {uri: image} : {uri: image.uri} }
            style={{
              width: 240,
              height: 135
            }}
          />
        ) : (
          <TouchableOpacity
            activeOpacity={.6}
            onPress={pickImage}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center'
            }}
          >
            <Ionicons size={24} name='images-outline' color={"#B0B0B0"} />
            <HelperText type='info'>
              Insert image here
            </HelperText>
          </TouchableOpacity>
        )}

      {image && (
        <TouchableOpacity
          onPress={() => setImage(undefined)}
        >
          <Ionicons
            name={'close-outline'}
            size={24}
            color='white'
            style={{
              position: 'absolute',
              bottom: 85,
              left: '30%',
              padding: 8,
              borderRadius: '100%',
              backgroundColor: 'hsla(0, 4%, 83%, 0.50)'
            }}
          />
        </TouchableOpacity>
      )}
    </View>

  );

  const header = (
    <React.Fragment>
      <View style={styles.header}>
        <Text style={styles.headerText}>Create an Event</Text>
      </View>
    </React.Fragment>
  )

  const form = (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 10,
        paddingBottom: 20
      }}
      keyboardDismissMode="interactive"
    >
      <View style={styles.container}>
        {/* Event Name */}
        <View style={styles.fieldContainer}>
          <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
            Event Name <Text style={{ color: (nameError ? 'red' : 'black') }}>*</Text>
          </Text>
          <TextInput
            placeholder="Enter event name"
            placeholderTextColor="#B0B0B0"
            value={newName}
            onChangeText={(value) => setNewName(value)}
            mode="outlined"
            dense
            activeOutlineColor={SECONDARY_COLOR}
            error={nameError}
          />
          <HelperText type="error" visible={nameError}>
            This is a required field.
          </HelperText>
        </View>

        {/* Description */}
        <View style={styles.fieldContainer}>
          <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
            Description <Text style={{ color: (descriptionError ? 'red' : 'black') }}>*</Text>
          </Text>
          <TextInput
            placeholder="Enter a description"
            value={newDescription}
            onChangeText={(value) => setNewDescription(value)}
            multiline
            placeholderTextColor="#B0B0B0"
            mode="outlined"
            activeOutlineColor={SECONDARY_COLOR}
            error={descriptionError}
          />
          <HelperText type="error" visible={descriptionError}>
            This is a required field.
          </HelperText>
        </View>

        {/* Tags */}
        <View style={styles.fieldContainer}>
          <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
            Event Category <Text style={{ color: 'black' }}>*</Text>
          </Text>
          {categoryDropDown}
          <HelperText type="error" visible={false}>
            Does nothing, for padding.
          </HelperText>
        </View>


        {/* DATE */}
        <View style={styles.fieldContainer}>
          <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
            Date <Text style={{ color: (dateError ? 'red' : 'black') }}>*</Text>
          </Text>
          <Pressable onPress={() => setOpenDate(true)}>
            <View pointerEvents="none">
              <TextInput
                placeholder="Enter a date"
                placeholderTextColor="#B0B0B0"
                value={date ? formatDate(date) : ""}
                editable={false}
                mode="outlined"
                dense
                activeOutlineColor={SECONDARY_COLOR}
                error={dateError}
              />
            </View>
          </Pressable>
          <HelperText type="error" visible={dateError}>
            Date must be in the future.
          </HelperText>
        </View>

        {/* DATE MODAL */}
        <Modal visible={openDate} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <Pressable
              style={styles.backdrop}
              onPress={() => setOpenDate(false)}
            />
            <View style={styles.modalBox}>
              <View style={{ height: 400, marginTop: 25 }}>
                <Calendar
                  onDayPress={(day) => {

                    setDate(new Date(day.year, day.month - 1, day.day))
                    setOpenDate(false);
                  }}
                  markedDates={{
                    [(date && formatDate(date)) || '']: { selected: true, selectedColor: PRIMARY_COLOR },
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* TIME */}
        <View style={styles.fieldContainer}>
          <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "500" }}>
            Time <Text style={{ color: (timeError ? 'red' : 'black') }}>*</Text>
          </Text>
          <Pressable onPress={() => setOpenTime(true)}>
            <View pointerEvents="none">
              <TextInput
                placeholder="Enter a time"
                placeholderTextColor="#B0B0B0"
                value={time ? formatTime(time) : ""}
                editable={false}
                mode="outlined"
                dense
                activeOutlineColor={SECONDARY_COLOR}
                error={timeError}
              />
            </View>
          </Pressable>
          <HelperText type="error" visible={timeError}>
            Time & date must be in the future.
          </HelperText>
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

        {imagePicker}
        <HelperText type="error" visible={false}>
          does nothing, for padding
        </HelperText>

        <TouchableOpacity
          activeOpacity={.6}
          onPress={() => handlePostEvent()}
          style={{
            backgroundColor: BUTTON_COLOR,
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "600", fontSize: 16, color: 'white' }}>
            Review Event
          </Text>
        </TouchableOpacity>
        <HelperText type="error" visible={formError}>
            There is an error in this form.
        </HelperText>
      </View>
    </ScrollView>
  )

  return (
    <GVArea>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        {header}
        {form}
      </View>
    </GVArea>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: PRIMARY_COLOR,
    height: '15%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
    alignContent: "center",
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
  },
  fieldContainer: {
    
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


