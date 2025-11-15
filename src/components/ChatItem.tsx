import React from "react"

type Props = {
    imagen: string;
    nombre: string;
    mensaje: string;
    fecha: number;
}

const ChatItem = ({imagen, nombre, mensaje, fecha,}: Props) => {
   return (
   <div className="flex border-4">
    <div>
    <img src={imagen} alt={nombre} className="size-15 border-4 "/>
    </div> 
    <div>
       <h1>{mensaje} </h1>
       <h1>{fecha}</h1>
    </div>
   </div>
   )}


   export default ChatItem