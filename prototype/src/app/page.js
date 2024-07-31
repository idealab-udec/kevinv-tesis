
import { MessageCircle, BotMessageSquare } from 'lucide-react'
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';


export default function Home() {
  return (
    <>
    <Sidebar/>
    <div className="container bg-mainBackground">
      <div className="flex items-center justify-center">
        <BotMessageSquare size={32} className='text-white'/>
        <h1 className="text-4xl font-bold text-white text-center ml-2 mr-1">Universidad de Concepción</h1>
        <MessageCircle size={32} className='text-white pl-1'/>
      </div>

      <Chat />
    </div>
    </>
  );
}