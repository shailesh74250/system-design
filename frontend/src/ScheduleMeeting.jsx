import React from 'react';
import { InlineWidget } from 'react-calendly';

const ScheduleMeeting = () => {
  return (
    <div style={{ height: '600px', width: '800px', marginLeft: '40%' }}>
      <InlineWidget
        url="https://calendly.com/shaileshmourya1995"
        styles={{ height: '100%', width: '100%' }}
        pageSettings={{
          backgroundColor: 'ffffff',
          primaryColor: '00a2ff',
          hideEventTypeDetails: false,
          hideLandingPageDetails: false,
        }}
      />
    </div>
  );
};

export default ScheduleMeeting;
