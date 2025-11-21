import {Ionicons} from '@expo/vector-icons'
import {View, Text} from 'react-native'
import {SECONDARY_COLOR} from '../constants/colors'
import {ReactNode} from 'react'

interface Props {
  /* see https://stackoverflow.com/a/72080205 */
  icon: keyof typeof Ionicons.glyphMap
  children: ReactNode
}

export default function IconField({icon, children}: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Ionicons
        name={icon}
        size={20}
        color={SECONDARY_COLOR}
        style={{
          marginRight: 5,
        }}
      />

      <View>
        <Text style={{ color: "#656565", fontSize: 13, lineHeight: 25 }}>
          {children}
        </Text>
      </View>
    </View>
  )
}
