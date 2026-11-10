import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ThreeObby from '../components/ThreeObby';

export default function Play() {
  const { id } = useParams();

  return (
    <div className="player">
      <div className="player-header">
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#666', fontWeight: 700 }}>
          ← Ana Menüye Dön
        </a>
      </div>
      <ThreeObby />
    </div>
  );
}