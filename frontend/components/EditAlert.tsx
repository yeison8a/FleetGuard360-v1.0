'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext'; 

interface EditAlertProps {
  id: string;
}

export default function EditAlert({ id }: EditAlertProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    mensaje: '',
    prioridad: '',
    tipoAlerta: '',
    responsables: '',
    conductor: '',
    placaTransporte: '',
    ubicacion: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const res = await fetch(`https://fleetguard360-v2-0.onrender.com/api/alerts/${id}`);
        if (!res.ok) throw new Error('No se pudo cargar la alerta');
        const data = await res.json();

        setFormData({
          mensaje: data.mensaje || '',
          prioridad: data.prioridad || '',
          tipoAlerta: data.tipoAlerta === 'BAJA' || data.tipoAlerta === 'MEDIA' || data.tipoAlerta === 'ALTA' ? data.tipoAlerta : '1',
          responsables: data.responsables || '',
          conductor: data.conductor || '',
          placaTransporte: data.placaTransporte || '',
          ubicacion: data.ubicacion || '',
        });

        setLoading(false);
      } catch (err) {
        setError('Error al cargar la alerta');
        setLoading(false);
      }
    };

    fetchAlert();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user?.id) {
      setError('Usuario no autenticado');
      return;
    }

    const payload = {
      ...formData,
      tipoAlerta: Number(formData.tipoAlerta), 
      generadaPor: user.id,
    };

    try {
      const res = await fetch(`https://fleetguard360-v2-0.onrender.com/api/alerts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Respuesta:', text);
        throw new Error(`Error al actualizar la alerta (Status: ${res.status})`);
      }

      setSuccess('Alerta actualizada correctamente');
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando alerta...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Editar Alerta</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mensaje</label>
            <textarea
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Prioridad</label>
              <select
                name="prioridad"
                value={formData.prioridad}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
              >
                <option value="">Seleccionar</option>
                <option value="BAJA">BAJA</option>
                <option value="MEDIA">MEDIA</option>
                <option value="ALTA">ALTA</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Alerta (ID)</label>
              <input
                type="number"
                name="tipoAlerta"
                value={formData.tipoAlerta}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Responsables</label>
              <input
                name="responsables"
                value={formData.responsables}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Conductor</label>
              <input
                name="conductor"
                value={formData.conductor}
                onChange={handleChange}
                className="w-full border rounded-md px-4 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Placa del Transporte</label>
            <input
              name="placaTransporte"
              value={formData.placaTransporte}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ubicación</label>
            <input
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}
