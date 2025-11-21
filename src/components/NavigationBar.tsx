import {Pressable, View} from 'react-native'
import {PRIMARY_COLOR} from '../constants/colors'
import {Ionicons} from '@expo/vector-icons'
import {useRouter} from 'expo-router'

export default function NavigationBar() {
  const router = useRouter()
  return (
    <View style={{
        height: 50,
        backgroundColor: PRIMARY_COLOR,
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      {router.canGoBack() &&
      <Pressable onPress={router.back}>
        <Ionicons
          name='chevron-back-outline'
          color='white'
          size={30}
          style={{
            marginLeft: 15
          }}
        />
      </Pressable>}
    </View>
  )
}
