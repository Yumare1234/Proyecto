import './App.css'
import ChatItem from './components/ChatItem';
// En src/App.tsx
function App() {

  const chatData = {
    imagen: 'ruta/a/mi-foto.jpg',
    nombre: 'Juan Pérez',
    mensaje: '¡Hola! ¿Cómo estás?',
    fecha: '10:30 Am'
  };

  return (
    <div className="bg-green-500">
      <h1> Whatsapp </h1>
      <ChatItem 
        imagen='src\components\imagenes\imagen.png'
        nombre='María Gómez'
        mensaje='Te envío un mensaje.'
        fecha= {1030} 
      />
    </div>
  );
}

export default App;