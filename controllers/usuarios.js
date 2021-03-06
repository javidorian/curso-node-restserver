const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({ estado: true }),
        Usuario.find({ estado: true })
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
};

const usuariosPost = async(req, res = response) => {


    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });


    //encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);


    //guardar en DB



    await usuario.save();


    res.json(usuario);
};

const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //TODO validar contra bse de datos

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);


    res.json({
        msg: "put API - controlador",
        usuario
    });
};

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    const uid = req.uid;

    //lo borramos fisicamente

    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    const usuarioAutenticado = req.usuarioAutenticado;

    res.json({
        msg: "delete API - controlador",
        usuario
    });
};

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "patch API - controlador"
    });
};



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
}