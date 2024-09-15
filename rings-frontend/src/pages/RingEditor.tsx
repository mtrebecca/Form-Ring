import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import RingForm from '../components/RingForm';
import RingList from '../components/RingList';
import axios from '../services/api';

const RingEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<any>(null);
  const [selectedRingId, setSelectedRingId] = useState<number | null>(null);
  const [refreshList, setRefreshList] = useState(false);

  useEffect(() => {
    const fetchRing = async () => {
      if (id || selectedRingId) {
        try {
          const ringIdToFetch = id || selectedRingId;
          const response = await axios.get(`/api/rings/${ringIdToFetch}`);
          setInitialData(response.data);
        } catch (error) {
          console.error("Erro ao buscar anel:", error);
        }
      }
    };

    fetchRing();
  }, [id, selectedRingId]);

  const handleEdit = (ringId: number) => {
    setSelectedRingId(ringId);
  };

  const handleFormSubmit = () => {
    setSelectedRingId(null);
    setInitialData(null);
    setRefreshList(!refreshList);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {initialData ? 'Editar Anel' : 'Criar Anel'}
      </h1>
      <RingForm initialData={initialData} onSubmit={handleFormSubmit} />

      <RingList onEdit={handleEdit} refreshList={refreshList} />
    </div>
  );
};

export default RingEditor;
