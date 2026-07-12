import React, { useState, useRef, useEffect } from 'react';

const DraggableFab = ({ initialX, initialY, onClick, title, children, style, onMouseOver, onMouseOut }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = dragRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    
    let newX = e.clientX - offset.current.x;
    let newY = e.clientY - offset.current.y;
    
    // Boundary check
    newX = Math.max(0, Math.min(newX, window.innerWidth - 48));
    newY = Math.max(0, Math.min(newY, window.innerHeight - 48));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    } else {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <button
      ref={dragRef}
      onPointerDown={handlePointerDown}
      onClick={(e) => {
        // Only trigger click if we didn't just drag it
        if (!isDragging) onClick(e);
      }}
      title={title}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
        width: '48px', height: '48px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: isDragging ? 'grabbing' : 'grab',
        ...style
      }}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {children}
    </button>
  );
};

export default DraggableFab;
