const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'no hay token en la peticion'
        });
    }


    try {


        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //leer usuario que corresponde al uid
        const usuarioAutenticado = await Usuario.findById(uid);

        if (!usuarioAutenticado) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en DB'
            });
        }

        //verificar si el usuario tiene estado: true

        if (!usuarioAutenticado.estado) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario con estado: false'
            });
        }

        req.usuarioAutenticado = usuarioAutenticado;
        req.uid = uid;

        next();
    } catch (error) {
        console.log(error);

        return res.status(401).json({
            msg: 'token no valido'
        });
    }

}



module.exports = {
    validarJWT
}