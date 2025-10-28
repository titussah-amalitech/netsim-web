import React from 'react';

export default function Form({ onSubmit, children, className = '', ...props }) {
  return (
    <form
      onSubmit={onSubmit}
      className={`bg-transparent  rounded-lg flex flex-col ${className}`}
      {...props}
    >
      {children}
    </form>
  );
}
