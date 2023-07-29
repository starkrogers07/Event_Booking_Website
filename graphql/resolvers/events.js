const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');


module.exports = {
    events: async () => {
      try {
        const events = await Event.find();
        return events.map(event => {
          return transformEvent(event);
        });
      } catch (err) {
        throw err;
      }
    },

    createEvent: async (args, req) => {   //args means "any number of values" i can pass & it will handle it
        if(!req.isAuth){
            throw new Error('Unauthenticated!');
        }      
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,             //+ is used to convert into float
            date: new Date(args.eventInput.date), 
            capacity: args.eventInput.capacity,
            creator: req.userId
        });

        let createdEvent;
        try{
        const result = await event.save();
            // console.log(result);
            createdEvent = transformEvent(result);  // result._doc.id.toString() we r using this as we will be accessing the
            const creator = await User.findById(req.userId);          // document then it's id and we will convert it to string which will be readable by graphQL

            if (!creator) {
                throw new Error('User not found.');
              }
              creator.createdEvents.push(event);
              await creator.save();
              return createdEvent;

            } catch (err) {
              console.log(err);
              throw err;
            }
          }
};