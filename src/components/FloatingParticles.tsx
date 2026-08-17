import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  type: 'fur' | 'star';
}

export default function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 10,
        size: 8 + Math.random() * 16,
        type: Math.random() > 0.7 ? 'star' : 'fur',
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          {particle.type === 'fur' ? (
            <div
              className="rounded-full opacity-60"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: `radial-gradient(circle, ${particle.size > 12 ? '#D4A574' : '#F8BBD9'} 0%, transparent 70%)`,
              }}
            />
          ) : (
            <div
              className="star"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)',
                borderRadius: '50%',
                boxShadow: '0 0 10px #FFD700',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
