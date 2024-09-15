import React from 'react';
import { Link } from 'react-router-dom';
import RingCarousel from '../components/RingCarousel';

const Home: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Lista de Anéis</h1>
        <Link
          to="/editor"
          className="text-black hover:underline"
        >
          Criar/Editar Anel
        </Link>
      </div>
      
      <RingCarousel />
    </div>
  );
};

export default Home;
