// host + /api/event
const { Router } = require("express");
const { check } = require("express-validator");

const { fieldValidator } = require("../middlewares/field-validators");
const { validateJWT } = require("../middlewares/validate-jwt");
const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/events");
const { isDate } = require("../helpers/isDate");

const router = Router();

// Validate JWT 
router.use( validateJWT );

// Get events
router.get('/', getEvents );

// Create event
router.post('/', [
    check( 'title', 'The title is require' ).notEmpty(),
    check( 'start', 'The start date is require').custom( isDate ),
    check( 'end', 'The end date is require').custom( isDate ),
    fieldValidator
], createEvent );

// Update event
router.put('/:id', [ //? Middlewares
    check( 'title', 'The title is require' ).notEmpty(),
    check( 'start', 'The start date is require').custom( isDate ),
    check( 'end', 'The end date is require').custom( isDate ),
    ], updateEvent );

// Delete event
router.delete('/:id', [ //? Middlewares
    check('id', 'A valid id is require').not().isEmpty(),
    ], deleteEvent );

module.exports = router;
