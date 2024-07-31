import React from 'react';

export default function Message({ message }) {
  const isHuman = message.role === 'human';
  return (
    <div className={`mb-4 ${isHuman ? 'text-right' : 'text-left'}`}>
      <div className={`inline-block p-2 rounded-lg ${isHuman ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
        {message.content}
      </div>
    </div>
  );
}