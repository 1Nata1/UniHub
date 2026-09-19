import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const PRIMARY = '#002F85';
const PRIMARY_DARK = '#00256e';

const typeOptions = [
  { value: 'palestra', label: 'Palestra' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'feira', label: 'Feira/Evento Grande' },
  { value: 'outro', label: 'Outro' },
];

export default function NewEvent() {
  const { user } = useAuth();
  const { addEvent } = useData();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    type: 'palestra',
    description: '',
    date: '',
    time: '19:00',
    location: '',
    capacity: '',
    image: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isAuthorized = user && user.type !== 'student';

  if (!isAuthorized) return navigate('/');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!form.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!form.date) newErrors.date = 'Data é obrigatória';
    if (!form.time) newErrors.time = 'Horário é obrigatório';
    if (!form.location.trim()) newErrors.location = 'Localização é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    addEvent({
      ...form,
      organizer: user.name,
      organizerId: user.id,
      capacity: form.capacity ? parseInt(form.capacity) : undefined,
    });
    setSubmitting(false);
    navigate('/meus-eventos');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/meus-eventos" className={`inline-flex items-center gap-1 text-sm font-medium mb-6 hover:text-[${PRIMARY_DARK}]`} style={{color: PRIMARY}}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Voltar
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Novo Evento</h1>
          <p className="text-gray-600 mb-8">Crie palestras, workshops, feiras e outros eventos</p>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título do evento <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={form.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.title ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
                placeholder="Ex: Workshop Prático: React Avançado + TypeScript"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600" role="alert">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
              >
                {typeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                value={form.description}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg outline-none resize-y ${errors.description ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
                placeholder="Descreva o evento, programação, palestrantes, público-alvo, etc."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600" role="alert">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Data <span className="text-red-500">*</span>
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  min={today}
                  value={form.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.date ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
                />
                {errors.date && <p className="mt-1 text-sm text-red-600" role="alert">{errors.date}</p>}
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                  Horário <span className="text-red-500">*</span>
                </label>
                <input
                  id="time"
                  name="time"
                  type="time"
                  required
                  value={form.time}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.time ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
                />
                {errors.time && <p className="mt-1 text-sm text-red-600" role="alert">{errors.time}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Localização <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={form.location}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.location ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
                placeholder="Ex: Auditório Principal - Bloco A, Lab de Informática 3, Online (Zoom)"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600" role="alert">{errors.location}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidade máxima (opcional)
                </label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
                  placeholder="Ex: 50"
                />
                <p className="mt-1 text-xs text-gray-500">Deixe em branco para ilimitado</p>
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  URL da imagem (opcional)
                </label>
                <input
                  id="image"
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">Link para imagem de capa do evento</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 px-6 py-3 font-medium rounded-lg disabled:opacity-50 transition-colors hover:bg-[${PRIMARY_DARK}]`} style={{backgroundColor: PRIMARY, color: 'white'}}
              >
                {submitting ? 'Criando...' : 'Criar Evento'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/meus-eventos')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}