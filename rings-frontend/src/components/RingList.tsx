import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Ring as RingType } from '../types';


type RingListProps = {
  onEdit: (id: number) => void;
  refreshList: boolean;
};

const RingList: React.FC<RingListProps> = ({ onEdit, refreshList }) => {
  const [ringList, setRingList] = useState<RingType[]>([]);
  const [selectedRingId, setSelectedRingId] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchRings = async () => {
      try {
        const response = await axios.get('/api/rings');
        setRingList(response.data);
      } catch (error) {
        console.error("Erro ao buscar lista de anéis:", error);
      }
    };

    fetchRings();
  }, [refreshList]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRings = ringList.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDelete = async () => {
    if (selectedRingId !== null) {
      try {
        await axios.delete(`/api/rings/${selectedRingId}`);
        setRingList(ringList.filter(ring => ring.id !== selectedRingId));
        setShowConfirmModal(false);
        toast.success('Anel excluído com sucesso!');
      } catch (error) {
        console.error("Erro ao excluir anel:", error);
      }
    }
  };

  const openConfirmModal = (ringId: number) => {
    setSelectedRingId(ringId);
    setShowConfirmModal(true);
  };

  const totalPages = Math.ceil(ringList.length / itemsPerPage);

  return (
    <div>
      <h2 className="text-xl font-bold mt-8 mb-4">Lista de Anéis</h2>
      <table className="table-auto w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2">Nome</th>
            <th className="px-4 py-2">Poder</th>
            <th className="px-4 py-2">Portador</th>
            <th className="px-4 py-2">Forjado Por</th>
            <th className="px-4 py-2">Imagem</th>
            <th className="px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {currentRings.map((ring) => (
            <tr key={ring.id} className="text-center">
              <td className="border px-4 py-2">{ring.nome}</td>
              <td className="border px-4 py-2">{ring.poder}</td>
              <td className="border px-4 py-2">{ring.portador}</td>
              <td className="border px-4 py-2">{ring.forjadoPor}</td>
              <td className="border px-4 py-2">
                <img src={ring.imagem} alt={ring.nome} className="w-16 h-16 object-cover mx-auto" />
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => onEdit(ring.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                >
                  Editar
                </button>
                <button
                  onClick={() => openConfirmModal(ring.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg">
            <p className="mb-4">Tem certeza que deseja excluir este anel?</p>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Sim
            </button>
            <button
              onClick={() => setShowConfirmModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Não
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RingList;
