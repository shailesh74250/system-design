import ScheduleMeeting from './ScheduleMeeting'
import EventList from './EventList'

function App() {

  return (
    <>
      <h1><center>Book a Meeting</center></h1>
      <ScheduleMeeting />
      <h2><center>Your Scheduled Events</center></h2>
      <EventList />
    </>
  )
}

export default App
