import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from '../services/api';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ConfirmationModal from './ConfirmationModal';
import { Ring as RingType } from '../types';

const RING_FORJADORES_LIMITS: Record<string, number> = {
  elfos: 3,
  anoes: 7,
  homens: 9,
  sauron: 1,
};

const RingCarousel: React.FC = () => {
  const [rings, setRings] = useState<RingType[]>([]);
  const [editingRingId, setEditingRingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<RingType>>({});
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRingId, setSelectedRingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRings = async () => {
      try {
        const response = await axios.get<RingType[]>('/api/rings');
        const uniqueRings = Array.from(new Map(response.data.map(ring => [ring.id, ring])).values());
        setRings(uniqueRings);
      } catch (error) {
        console.error("Erro ao buscar anéis:", error);
      }
    };

    fetchRings();
  }, []);

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const validateForjadorLimit = async (forjadoPor: string) => {
    const normalizedForjadoPor = normalizeText(forjadoPor);

    try {
      const response = await axios.get<RingType[]>("/api/rings");
      const rings = response.data;

      const countMap = rings.reduce(
        (acc: Record<string, number>, ring: RingType) => {
          const key = normalizeText(ring.forjadoPor);
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        },
        {}
      );

      const currentCount = countMap[normalizedForjadoPor] || 0;
      const limit = RING_FORJADORES_LIMITS[normalizedForjadoPor];

      if (typeof limit === "number") {
        if (currentCount >= limit) {
          return `Limite de ${limit} anéis forjados por ${forjadoPor} atingido.`;
        }
      } else {
        console.warn("Limite não definido para o forjador:", forjadoPor);
        return `Limite não definido para o forjador ${forjadoPor}.`;
      }

      return null;
    } catch (error) {
      return "Erro ao validar o limite de forjadores.";
    }
  };

  const handleEditClick = (ring: RingType) => {
    setEditingRingId(ring.id);
    setEditForm(ring);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleEditSave = async () => {
    if (editingRingId !== null) {
      if (editForm.forjadoPor) {
        const errorMessage = await validateForjadorLimit(editForm.forjadoPor);
        if (errorMessage) {
          setError(errorMessage);
          setTimeout(() => setError(null), 3000);
          return;
        }
      }

      try {
        await axios.put(`/api/rings/${editingRingId}`, editForm);
        const response = await axios.get<RingType[]>('/api/rings');
        const uniqueRings = Array.from(new Map(response.data.map(ring => [ring.id, ring])).values());
        setRings(uniqueRings);
        setEditingRingId(null);
        setEditForm({});
      } catch (error) {
        console.error("Erro ao atualizar anel:", error);
      }
    }
  };

  const handleEditCancel = () => {
    setEditingRingId(null);
    setEditForm({});
  };

  const handleDeleteClick = (id: number) => {
    setSelectedRingId(id);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedRingId !== null) {
      try {
        await axios.delete(`/api/rings/${selectedRingId}`);
        const response = await axios.get<RingType[]>('/api/rings');
        const uniqueRings = Array.from(new Map(response.data.map(ring => [ring.id, ring])).values());
        setRings(uniqueRings);
        setSelectedRingId(null);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Erro ao deletar anel:", error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setSelectedRingId(null);
    setIsModalOpen(false);
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="max-w-screen-xl mx-auto overflow-hidden">
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}
      <Slider {...settings}>
        {rings.map(ring => (
          <div key={ring.id} className="p-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              {ring.imagem && <img src={ring.imagem} alt={ring.nome} className="w-full h-48 object-cover" />}
              <div className="p-4">
                {editingRingId === ring.id ? (
                  <div>
                    <input
                      type="text"
                      name="nome"
                      value={editForm.nome || ''}
                      onChange={handleEditChange}
                      className="border p-2 mb-2 w-full"
                      placeholder="Nome"
                    />
                    <input
                      type="text"
                      name="poder"
                      value={editForm.poder || ''}
                      onChange={handleEditChange}
                      className="border p-2 mb-2 w-full"
                      placeholder="Poder"
                    />
                    <input
                      type="text"
                      name="portador"
                      value={editForm.portador || ''}
                      onChange={handleEditChange}
                      className="border p-2 mb-2 w-full"
                      placeholder="Portador"
                    />
                    <input
                      type="text"
                      name="forjadoPor"
                      value={editForm.forjadoPor || ''}
                      onChange={handleEditChange}
                      className="border p-2 mb-2 w-full"
                      placeholder="Forjado Por"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleEditSave}
                        className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                      >
                        Salvar
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="bg-gray-500 text-white py-2 px-4 rounded"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold">{ring.nome}</h3>
                    <p className="text-gray-700">{ring.poder}</p>
                    <p className="text-gray-600">Portador: {ring.portador}</p>
                    <p className="text-gray-600">Forjado por: {ring.forjadoPor}</p>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => handleEditClick(ring)}
                        className="bg-yellow-500 text-white py-2 px-4 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(ring.id)}
                        className="bg-red-500 text-white py-2 px-4 rounded"
                      >
                        Deletar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <ConfirmationModal
        isOpen={isModalOpen}
        message="Tem certeza de que deseja deletar este anel?"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default RingCarousel;
