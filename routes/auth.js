// host + /api/auth
const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/field-validators');
const { validateJWT } = require('../middlewares/validate-jwt');

router.post(
    '/new',
    [ //? MiddleWares
        check( 'name', 'The name is require' ).not().isEmpty(),
        check( 'email', 'Not a valid email' ).isEmail(),
        check( 'password', 'The password should be at least 6 characters long' ).isLength({ min: 6}),
        fieldValidator,
    ], createUser)
    
router.post(
    '/',
    [ //? Middlewares
    check( 'email', 'Not a valid email' ).isEmail(),
    check( 'password', 'The password should be at least 6 characters long' ).isLength({ min: 6 }),
    fieldValidator,
    ]
    , loginUser)

router.get('/renew', validateJWT, renewToken)


module.exports = router;