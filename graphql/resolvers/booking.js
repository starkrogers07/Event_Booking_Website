const Event = require('../../models/event');
const Booking = require('../../models/booking');
const {transformBooking, transformEvent } = require('./merge');

module.exports = {
    bookings: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated!');
        }
        try {
          const bookings = await Booking.find({user: req.userId});
          return bookings.map(booking => {
            return transformBooking(booking);
          });
        } catch (err) {
          throw err;
        }
      },

      bookEvent: async (args, req) => {
        if(!req.isAuth){
            throw new Error('Unauthenticated!');
        }
        const fetchedEvent = await Event.findOneAndUpdate(
          { _id: args.eventId, capacity: { $gt: 0 } }, // Only find events with capacity greater than 0
          { $inc: { capacity: -1 } }, // Reduce the capacity by 1
          { new: true } // Return the updated event
        );
      
        if (!fetchedEvent) {
          throw new Error('Event not found or fully booked.');
        }
      
        const booking = new Booking({
          user: req.userId,
          event: fetchedEvent
        });
      
        const result = await booking.save();
        return transformBooking(result);
      },
      
      cancelBooking: async (args, req) => {
        if (!req.isAuth) {
          throw new Error("Unauthenticated!");
        }
      
        try {
          const booking = await Booking.findById(args.bookingId).populate("event");
          if (!booking) {
            throw new Error("Booking not found.");
          }
      
          const event = transformEvent(booking.event);
          const eventId = event._id.toString();
      
          await Booking.deleteOne({ _id: args.bookingId });
      
          // Update the event capacity by incrementing it
          await Event.updateOne({ _id: eventId }, { $inc: { capacity: 1 } });
      
          return event;
        } catch (err) {
          throw err;
        }
      }
    
};