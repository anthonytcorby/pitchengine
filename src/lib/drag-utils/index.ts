import React from 'react';

export const setDragGhost = (e: React.DragEvent, number: number, position: string) => {
    const ghost = document.createElement('div');

    // Base styles
    Object.assign(ghost.style, {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '2px solid black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: '900',
        position: 'absolute',
        top: '-9999px',
        zIndex: '9999',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
    });

    if (position === 'GK') {
        ghost.style.backgroundColor = '#facc15'; // yellow-400
        ghost.style.color = '#000000';
    } else {
        ghost.style.backgroundColor = '#00FF41'; // wts-green
        ghost.style.color = '#000000';
    }

    ghost.innerText = number.toString();

    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 20, 20);

    setTimeout(() => {
        try {
            document.body.removeChild(ghost);
        } catch (error) {
            // Ignore if already removed
        }
    }, 0);
};
