import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function DraggableSection({ id, isDragMode, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isDragMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragMode ? 'move' : 'default',
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {isDragMode && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: '#9300c5',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          zIndex: 10,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⋮⋮</span>
          <span>Drag to Reorder</span>
        </div>
      )}
      {children}
    </div>
  );
}
