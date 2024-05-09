const { response } = require("express");
const Event = require("../models/Event");
// const { generateJWT } = require("../helpers/jwt");

// Get Calendar Events from database
const getEvents = async( req, res = response) => {

    const events = await Event.find()
                                .populate('user', 'name');

    return res.status(200).json({
        ok: true,
        events
    })

};

// Create Calendar Events from database
const createEvent = async( req, res = response) => {

    const event = new Event( req.body );

    try {

        event.user = req.uid;

        const savedEvent = await event.save();

        return res.json({
            ok: true,
            event: savedEvent,

        })
        
    } catch (error) {
        console.log( error );
        return res.status(500).json({
            ok: false,
            msg: 'Contact an Admin.'
        })
    }


};

// Update Calendar Events from database
const updateEvent = async( req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        
        const event = await Event.findById( eventId );

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Event not found with provided id'
            })
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'You do not have privileges to edit this event'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        };

        const updatedEvent = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        return res.json({
            ok: true,
            event: updatedEvent
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Contact an Admin'
        })
        
    }
        
};

// Delete Calendar Events from database
const deleteEvent = async( req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;

    
    try {

        const event = await Event.findById( eventId )
        
        if( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Event not found with provided id'
            })
        }

        if( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false, 
                msg: 'You do not have privileges to delete this event'
            })
        }

        const deletedEvent = await Event.findByIdAndDelete( eventId );

        return res.json({
            ok: true,
            msg: 'Event deleted successfully!',
            deletedEvent
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contact an Admin'
        })
    }

};

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
}