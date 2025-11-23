import React from 'react';
import {ScrollView} from 'react-native';
import GVArea from '@/src/components/GVArea';
import NavigationBar from '@/src/components/NavigationBar';
import OrganizationCard from '@/src/components/OrganizationCard';
import EventInfo from '@/src/components/EventInfo';

export default function Event() {
    return (
      <GVArea>
            <NavigationBar />
            {/* Scrollable Content */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingTop: 30 }}
            >
              <EventInfo />
              <OrganizationCard />
            </ScrollView>
        </GVArea>
    );
}
