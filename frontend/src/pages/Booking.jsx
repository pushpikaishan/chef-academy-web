import BookingForm from '../components/bookings/BookingForm'

export default function Booking(){
  return (
    <div style={{padding:'24px'}}>
      <h1 style={{marginBottom:12}}>Booking</h1>
      <p style={{color:'#555',marginBottom:16}}>Submit your booking details and we will get back to you.</p>
      <div style={{maxWidth:600}}>
        <BookingForm />
      </div>
    </div>
  )
}
