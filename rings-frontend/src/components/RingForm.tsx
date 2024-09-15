import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "../services/api";
import { toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModal";

type RingFormProps = {
  initialData?: {
    id: number;
    nome: string;
    poder: string;
    portador: string;
    forjadoPor: string;
    imagem: string;
  };
  onSubmit: () => void;
};

const RING_FORJADORES_LIMITS: Record<string, number> = {
  elfos: 3,
  anoes: 7,
  homens: 9,
  sauron: 1,
};

const RingForm: React.FC<RingFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    nome: "",
    poder: "",
    portador: "",
    forjadoPor: "",
    imagem: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [imageList, setImageList] = useState<string[]>([]);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        nome: "",
        poder: "",
        portador: "",
        forjadoPor: "",
        imagem: "",
      });
    }
  }, [initialData]);

  useEffect(() => {
    setImageList([
      "/assets/images/1.png",
      "/assets/images/2.png",
      "/assets/images/3.png",
      "/assets/images/4.png",
      "/assets/images/5.png",
    ]);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData((prevData) => ({ ...prevData, imagem: imageUrl }));
    setModalOpen(false);
  };

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const validateForjadorLimit = async () => {
    const normalizedForjadorPor = normalizeText(formData.forjadoPor);

    try {
      const response = await axios.get("/api/rings");
      const rings = response.data;

      const countMap = rings.reduce(
        (acc: Record<string, number>, ring: { forjadoPor: string }) => {
          const key = normalizeText(ring.forjadoPor);
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        },
        {}
      );
      const currentCount = countMap[normalizedForjadorPor] || 0;
      const limit = RING_FORJADORES_LIMITS[normalizedForjadorPor];

      if (typeof limit === "number") {
        if (currentCount >= limit) {
          return `Limite de ${limit} anéis forjados por ${formData.forjadoPor} atingido.`;
        }
      } else {
        console.warn(
          "Limite não definido para o forjador:",
          formData.forjadoPor
        );
        return `Limite não definido para o forjador ${formData.forjadoPor}.`;
      }

      return null;
    } catch (error) {
      console.error("Erro ao validar limite de forjadores:", error);
      return "Erro ao validar o limite de forjadores.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const errorMessage = await validateForjadorLimit();
    if (errorMessage) {
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
      return;
    }
  
    const payload = {
      ...formData,
      imagem: formData.imagem || "/assets/images/1.png",
    };

    try {
      if (initialData) {
        setConfirmModalOpen(true);
      } else {
        await axios.post("/api/rings", payload);
        toast.success("Anel criado com sucesso!");
        onSubmit();
        setFormData({
          nome: "",
          poder: "",
          portador: "",
          forjadoPor: "",
          imagem: "",
        });
        setError(null);
      }
    } catch (error) {
      console.error("Erro ao salvar o anel:", error);
      setError("Erro ao salvar o anel. Tente novamente.");
    }
  };

  const handleConfirmUpdate = async () => {
    setConfirmModalOpen(false);
    try {
      if (initialData) {
        await axios.put(`/api/rings/${initialData.id}`, formData);
        toast.success("Anel atualizado com sucesso!");
        onSubmit();
        setFormData({
          nome: "",
          poder: "",
          portador: "",
          forjadoPor: "",
          imagem: "",
        });
        setError(null);
      }
    } catch (error) {
      console.error("Erro ao atualizar o anel:", error);
      setError("Erro ao atualizar o anel. Tente novamente.");
    }
  };

  const handleConfirmCancel = () => {
    setConfirmModalOpen(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white rounded-lg shadow-md max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Formulário do Anel
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <input
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome do anel"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            name="poder"
            value={formData.poder}
            onChange={handleChange}
            placeholder="Poder do anel"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            name="portador"
            value={formData.portador}
            onChange={handleChange}
            placeholder="Portador do anel"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            name="forjadoPor"
            value={formData.forjadoPor}
            onChange={handleChange}
            placeholder="Forjador do anel"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Selecionar Imagem
          </button>
          {formData.imagem && (
            <div className="mt-2">
              <img
                src={formData.imagem}
                alt="Imagem selecionada"
                className="w-full h-auto rounded-md"
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {initialData ? "Atualizar Anel" : "Criar Anel"}
        </button>
      </form>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
      >
        <div className="bg-white p-8 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Selecionar Imagem</h2>
          <div className="grid grid-cols-3 gap-4">
            {imageList.map((imageUrl) => (
              <div
                key={imageUrl}
                className="cursor-pointer"
                onClick={() => handleImageSelect(imageUrl)}
              >
                <img
                  src={imageUrl}
                  alt="Imagem"
                  className="w-full h-auto rounded-lg border border-gray-300"
                />
              </div>
            ))}
          </div>
          <button
            onClick={() => setModalOpen(false)}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Fechar
          </button>
        </div>
      </Modal>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        message="Você tem certeza que deseja atualizar este anel?"
        onConfirm={handleConfirmUpdate}
        onCancel={handleConfirmCancel}
      />
    </div>
  );
};

export default RingForm;
