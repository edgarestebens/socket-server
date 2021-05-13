import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuarioLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';


export const usuariosConectado = new UsuarioLista();

export const conectarCliente = (cliente: Socket) => {

    const usuario = new Usuario( cliente.id);
    usuariosConectado.agregar(usuario);
} 

export const desconectar = (cliente: Socket) => {
    cliente.on('disconnect', () => {
        console.log('cliente Desconectado');

        usuariosConectado.borrarUsuario(cliente.id);
    });


}

//escuchar mensaje
export const mensaje = (cliente: Socket, io: socketIO.Server) => {

    cliente.on('mensaje', (payload: {de: string, cuerpo: string}) =>{

        console.log('mensaje recibido', payload);


        io.emit('mensaje-nuevo', payload);


    });

}

//configurar usuario
export const configurarUsuario = (cliente: Socket, io: socketIO.Server) => {

    cliente.on('configurar-usuario', (payload: {nombre: string}, callback: Function) =>{


        usuariosConectado.actualizarNombre( cliente.id, payload.nombre);
        

        callback({
            ok: true,
            mensaje: `Usuario ${payload.nombre}, configurado`
        });
    });

}
