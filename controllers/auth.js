const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser =  async(req, res = response) => {

    const { email, password } = req.body;
    try {

        let user = await User.findOne({ email });
        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'This email already exist'
            });
        }

        user = new User( req.body );

        // encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );
    
        await user.save();

        // Generate JWT
        const token = await generateJWT( user.id, user.name );
    
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok:false,
            msg: 'Comuniquese con el admin'
        });
    }

};

const loginUser = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'This email doesnt exist'
            });
        }

        // Validate password
        const validPassword = bcrypt.compareSync( password, user.password );

        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrect'
            });
        }

        // Generate JWT
        const token = await generateJWT( user.id, user.name );

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
        
    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok:false,
            msg: 'Comuniquese con el admin'
        });
    }



}

const renewToken = async(req, res = response) => {

    const { uid, name } = req;

    // Generate new JWT
    const token = await generateJWT( uid, name )    

    res.json({
        ok: true,
        uid,
        name,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    renewToken
};