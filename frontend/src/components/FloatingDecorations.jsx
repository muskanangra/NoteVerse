import React from 'react';

export default function FloatingDecorations() {
  const elements = [
    { emoji: '🍒', top: '12%', left: '8%', size: '3.5rem', rotate: '12deg', delay: '0s' },
    { emoji: '🎀', top: '22%', right: '10%', size: '3.2rem', rotate: '-15deg', delay: '1s' },
    { emoji: '✨', top: '48%', left: '5%', size: '2.5rem', rotate: '25deg', delay: '2s' },
    { emoji: '🍭', top: '75%', right: '8%', size: '3rem', rotate: '-20deg', delay: '1.5s' },
    { emoji: '🧸', top: '65%', left: '12%', size: '3.2rem', rotate: '10deg', delay: '3s' },
    { emoji: '🍓', top: '85%', left: '48%', size: '2.8rem', rotate: '5deg', delay: '0.5s' },
    { emoji: '⭐️', top: '15%', left: '45%', size: '2rem', rotate: '-10deg', delay: '2.5s' },
    { emoji: '💖', top: '35%', right: '45%', size: '2.4rem', rotate: '15deg', delay: '1.8s' }
  ];

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 1
    }}>
      {elements.map((el, i) => (
        <span
          key={i}
          className="sticker"
          style={{
            position: 'absolute',
            top: el.top,
            left: el.left,
            right: el.right,
            fontSize: el.size,
            transform: `rotate(${el.rotate})`,
            animationDelay: el.delay,
            opacity: 0.85
          }}
        >
          {el.emoji}
        </span>
      ))}
    </div>
  );
}
