import {Text, ScrollView} from 'react-native';
import GVArea from '@components/GVArea';
import OrganizationInfo from '@/src/components/OrganizationInfo';
import EventCard from '@/src/components/EventCard';

export default function OrganizationPage() {
	return (
    <GVArea>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <OrganizationInfo />
        <Text style={{
            marginTop: 30,
            marginBottom: 5,
            marginLeft: 30,
            fontSize: 16,
            fontWeight: 600
          }}
        >
          Events from this organization
        </Text>
        <EventCard />
        <EventCard />
      </ScrollView>
    </GVArea>
  )
}
