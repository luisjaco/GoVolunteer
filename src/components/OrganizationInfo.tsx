import {Text, View} from 'react-native';
import {PRIMARY_COLOR} from '../constants/colors';
import IconField from './IconField';

export default function OrganizationInfo() {
  return (
    <View
      style={{
        marginHorizontal: 20,
        marginTop: 10,
        padding: 20,
        paddingBottom: 10,
        borderRadius: 10,
        borderColor: "#B8B8B8",
        borderWidth: 1,
      }}
    >
      <View style={{
          flexDirection: "row",
          alignItems: 'center'
        }}
      >
        {/* Profile Picture */}
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%', 
            backgroundColor: PRIMARY_COLOR,
            justifyContent: "center",
            alignItems: "center",
          }}
        />

        <View style={{
            flexDirection: 'column',
            marginLeft: 10,
            top: '25%'
          }}
        >
          <View>
            <Text
              style={{
                lineHeight: 20,
                fontWeight: "600",
                fontSize: 16,
                maxWidth: '75%'
              }}
            >
              John Doe Foundation
            </Text>
          </View>


          {/* Organization Motto */}
          <View>
            <Text style={{
                color: "#656565",
                fontWeight: "500",
                marginBottom: 30,
                fontSize: 12,
                marginRight: 10,
                maxWidth: '75%'
              }}
            >
              Dedicated to preserving the John Doe ecosystem
            </Text>
          </View>
        </View>
      </View>

      {/* Info Icons */}
      <IconField icon='location-outline'>
        Arlington, VA
      </IconField>
      <IconField icon='mail-outline'>
        outreach@johndoefoundation.org
      </IconField>
      <IconField icon='call-outline'>
        +1 (555) 555-5555
      </IconField>
      <IconField icon='globe-outline'>
        johndoefoundation.org/volunteer
      </IconField>
      <View
        style={{
          height: 1,
          backgroundColor: "#B8B8B8",
          marginTop: 25,
          marginBottom: 25
        }}
      />
      {/* About this organization */}
      <View>
        <Text
          style={{
            lineHeight: 20,
            fontWeight: "600",
          }}
        >
          About this Organization
        </Text>
      </View>
      {/* Description */}
      <View>
        <Text
          style={{
            color: "#656565",
            marginTop: 8,
            fontWeight: "400",
            fontSize: 14,
            marginBottom: 25,
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec enim nibh, ultrices ac lobortis id, faucibus sit amet neque. Maecenas vulputate mauris quis sapien posuere, quis euismod orci eleifend. Ut feugiat ex massa. Vestibulum imperdiet gravida odio et euismod. Nulla facilisi.
        </Text>
      </View>
    </View>
  )
}
