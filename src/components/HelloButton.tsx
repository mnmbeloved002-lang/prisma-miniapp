import React from 'react'

export const HelloButton = () => {
  return (
    <button 
      onClick={() => console.log('Hello')}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Hello
    </button>
  )
}
