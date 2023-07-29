import React from 'react';
import './EventItem.css';

const eventItem = (props) => {
  let capacityText = props.capacity > 0 ? `Slots left ${props.capacity}` : 'Bookings Closed';

  // Check if the event date has already passed
  const eventDate = new Date(props.date);
  const currentDate = new Date();
  const isEventPassed = eventDate <= currentDate;
  
  return (
    <li key={props.eventId} className="events__list-item">
      <div>
        <h1>{props.title}</h1>
        <h2>
          Rs{props.price} - {new Date(props.date).toLocaleDateString()}{' '}
          {isEventPassed ? 'Event Passed' : capacityText}
        </h2>
      </div>
      <div>
        {props.userId === props.creatorId ? (
          <p>You are the owner of this event.</p>
        ) : (
          <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>
          View Details
          </button>
        )}
      </div>
    </li>
  );
};

export default eventItem;
