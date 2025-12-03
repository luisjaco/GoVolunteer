import { Text, ScrollView, View } from 'react-native';
import GVArea from '@components/GVArea';
import OrganizationInfo from '@/src/components/OrganizationInfo';
import EventCard from '@/src/components/EventCard';
import NavigationBar from '@/src/components/NavigationBar';
import supabase from '@/src/utils/requests';
import { useState, useEffect } from 'react';
import { Organization, Event } from '@/src/utils/requests';
import { useLocalSearchParams } from 'expo-router';
import { PRIMARY_COLOR } from '@/src/constants/colors';
import OrganizationCard from '@/src/components/OrganizationCard';

type EventExtended = Event & {
  organization_title: string,
  organization_profile_url: string,
  category_name: string
}

export default function OrganizationPage() {

  const [organization, setOrganization] = useState<Organization>();
  const [email, setEmail] = useState('');
  const [events, setEvents] = useState<EventExtended[]>();

  const { id } = useLocalSearchParams();

  const fetchOrganizationInfo = async () => {
    const { data, error } = await supabase.from('organizations').select('*').eq('user_id', id).single();

    console.log(`[organizations/${id}] grabbing information from organizations table`);
    if (error || data.length === 0) {
      console.log(`[organizations/${id}] error: grabbing from organizations table ${error}`);
      return;
    }
    else {
      setOrganization(data);
    }
  }

  const fetchEmail = async () => {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();

    console.log(`[organizations/${id}] grabbing information from users table`);
    if (error || !data || data.length === 0) {
      console.log(`[organizations/${id}] error: grabbing from users table ${error}`);
      return;
    }
    else {
      setEmail(data.email);
    }
  }

  const fetchEvents = async () => {


    console.log('[Feed] grabbing information from organizations table');

    const { data, error } = await supabase
      .from('events')
      .select(`
        id,
        name,
        created_at,
        organization_id,
        description,
        state,
        city,
        max_volunteers,
        current_volunteers,
        image_url,
        date_time,
        category_id,
        categories (
          id,
          name
        ),
        users!events_organization_id_fkey (
          id,
          organizations (
            user_id,
            title,
            profile_picture_url
            )
        )
        `).order('created_at', { ascending: true })
      .eq('organization_id', id);


    if (error || data.length === 0) {
      console.log('[Feed] error: grabbing from organizations table', error);
      return;
    }
    else {
      const events: EventExtended[] = data.map((e) => ({
        id: e.id as number,
        name: e.name as string,
        organization_id: e.organization_id as string,
        category_id: e.category_id as number,
        category_name: (e.categories as any).name as string,
        description: e.description as string,
        state: e.state as string,
        city: e.city as string,
        max_volunteers: e.max_volunteers as number,
        current_volunteers: e.current_volunteers as number,
        image_url: e.image_url as string,
        date_time: e.date_time as Date,
        organization_title: (e.users as any).organizations.title as string || '',
        organization_profile_url: (e.users as any).organizations.profile_picture_url as string || '',
      }));

      setEvents(events);


    }
  }


  const init = async () => {
    await fetchOrganizationInfo();
    await fetchEmail();
    await fetchEvents();
  }

  useEffect(() => {
    init();
  }, []);

  const header = (
    <View style={{
      backgroundColor: PRIMARY_COLOR,
      height: '15%',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
      alignItems: 'center',
      paddingHorizontal: '5%',
    }}>

      <View>
        {/*HEADER TITLE*/}
        <Text style={{
          color: 'white',
          fontWeight: '500',
          paddingBottom: 5,
          fontSize: 24,
        }}>
          {organization?.title}'s Page
        </Text>
        <Text style={{
          color: 'white',
          fontSize: 14,
          opacity: 0.9,
        }}>
          Events & Information
        </Text>
      </View>

    </View>
  );

  const body = (
    <View
      style={{
        marginTop: '5%',
        marginHorizontal: '10%',
        paddingVertical: 5,
        borderBottomWidth: .5,
        borderBottomColor: '#B8B8B8',
      }}
    >
      <Text style={{ fontWeight: 'bold', color: '#656565', fontSize: 15 }}>
        Events from this organization
      </Text>
    </View>
  )

  const feed = (
    <View>
      {events?.map((event, key) => (
        <EventCard
          key={key}
          event_id={event.id}
          name={event.name}
          organization_id={event.organization_id}
          categoryName={event.category_name}
          description={event.description}
          state={event.state}
          city={event.city}
          maxVolunteers={event.max_volunteers}
          currentVolunteers={event.current_volunteers}
          imageURI={event.image_url}
          timestampz={event.date_time.toString()}
          organization_profile_picture_url={event.organization_profile_url}
          organization_title={event.organization_title}
        />
      ))}
    </View>
  )


  return (
    <GVArea>
      {header}
      <ScrollView style={{paddingVertical: '5%'}}>
        {(organization && email) && (
          <OrganizationCard
            title={organization.title}
            motto={organization.motto}
            phone={organization.phone}
            email={email}
            organizationURL={organization.organization_url}
            state={organization.state}
            city={organization.city}
            description={organization.description}
            profilePictureURL={organization.profile_picture_url}
          />
        )}
        {body}
        {feed}
      </ScrollView>
    </GVArea>
  )
}