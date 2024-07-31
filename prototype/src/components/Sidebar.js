'use client'
import React, { useState } from 'react';
// import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div 
      className={`fixed top-0 left-0 h-full transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out bg-gray-800 text-white w-64 shadow-lg`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="w-8 h-full absolute top-0 right-[-8px] bg-gray-800 hover:bg-gray-700 cursor-pointer"
      >
        {/* Esto es la pequeña marca */}
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">UdeC</h2>
        <ul>
          <li className="mb-2"><a href="#" className="hover:underline">Politica de Uso Ético</a></li>
          <li className="mb-2"><a href="#" className="hover:underline">¿Como hablar con la IA?</a></li>
          <li className="mb-2"><a href="#" className="hover:underline">Descargar Conversación</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
