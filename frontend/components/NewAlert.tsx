'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function NewAlert() {
  const [formData, setFormData] = useState({
    mensaje: '',
    prioridad: '',
    tipoAlerta: '',
    responsables: '',
    conductor: '',
    placaTransporte: '',
    ubicacion: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { user } = useAuth(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user?.id) {
      setError('No se encontró el usuario autenticado.');
      return;
    }

    try {
      const alerta = {
        ...formData,
        generadaPor: user.id, 
      };

      const response = await fetch('https://fleetguard360-v2-0.onrender.com/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alerta),
      });

      if (!response.ok) {
        throw new Error('Error al crear la alerta');
      }

      setSuccess('Alerta creada con éxito');
      setFormData({
        mensaje: '',
        prioridad: '',
        tipoAlerta: '',
        responsables: '',
        conductor: '',
        placaTransporte: '',
        ubicacion: '',
      });

    setTimeout(() => {
        router.back();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Crear Nueva Alerta</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
            <textarea
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
              <select
                name="prioridad"
                value={formData.prioridad}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Seleccionar</option>
                <option value="BAJA">BAJA</option>
                <option value="MEDIA">MEDIA</option>
                <option value="ALTA">ALTA</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Alerta (ID)</label>
              <input
                type="number"
                name="tipoAlerta"
                value={formData.tipoAlerta}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsables</label>
              <input
                name="responsables"
                value={formData.responsables}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conductor</label>
              <input
                name="conductor"
                value={formData.conductor}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Placa del Transporte</label>
            <input
              name="placaTransporte"
              value={formData.placaTransporte}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <input
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Crear Alerta
          </button>
        </form>
      </div>
    </div>
  );
}
