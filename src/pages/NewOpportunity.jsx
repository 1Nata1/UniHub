import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const PRIMARY = '#002F85';
const PRIMARY_DARK = '#00256e';
const PRIMARY_BORDER = '#c5d8fb';

const typeOptions = [
  { value: 'estagio', label: 'Estágio' },
  { value: 'projeto', label: 'Projeto de Pesquisa/IC' },
  { value: 'vaga', label: 'Vaga Júnior/Emprego' },
];

export default function NewOpportunity() {
  const { user } = useAuth();
  const { addOpportunity } = useData();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    type: 'estagio',
    description: '',
    workload: '',
    location: '',
    requirements: '',
    benefits: '',
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
    if (!form.workload.trim()) newErrors.workload = 'Carga horária é obrigatória';
    if (!form.location.trim()) newErrors.location = 'Localização é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    addOpportunity({
      ...form,
      company: user.name,
      companyId: user.id,
      requirements: form.requirements.split('\n').filter(r => r.trim()),
      benefits: form.benefits.split('\n').filter(b => b.trim()),
    });
    setSubmitting(false);
    navigate('/minhas-oportunidades');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/minhas-oportunidades" className={`inline-flex items-center gap-1 text-sm font-medium mb-6 hover:text-[${PRIMARY_DARK}]`} style={{color: PRIMARY}}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Voltar
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Nova Oportunidade</h1>
          <p className="text-gray-600 mb-8">Preencha os detalhes da vaga, estágio ou projeto</p>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título da oportunidade <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={form.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}] ${errors.title ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Ex: Estágio em Desenvolvimento Full Stack"
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
                placeholder="Descreva a oportunidade, responsabilidades, tecnologias, etc."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600" role="alert">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="workload" className="block text-sm font-medium text-gray-700 mb-1">
                  Carga horária <span className="text-red-500">*</span>
                </label>
                <input
                  id="workload"
                  name="workload"
                  type="text"
                  required
                  value={form.workload}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.workload ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
                  placeholder="Ex: 30h/semana, 20h/semana, 40h/semana"
                />
                {errors.workload && <p className="mt-1 text-sm text-red-600" role="alert">{errors.workload}</p>}
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
                  placeholder="Ex: São Paulo - SP (Híbrido), Remote, Campus Universitário"
                />
                {errors.location && <p className="mt-1 text-sm text-red-600" role="alert">{errors.location}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                Requisitos (um por linha)
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={4}
                value={form.requirements}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none resize-y focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
                placeholder="Cursando Ciência da Computação&#10;Conhecimento em JavaScript/TypeScript&#10;Noções de React e Node.js&#10;Git/GitHub"
              />
              <p className="mt-1 text-xs text-gray-500">Separe cada requisito com Enter</p>
            </div>

            <div>
              <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
                Benefícios (um por linha)
              </label>
              <textarea
                id="benefits"
                name="benefits"
                rows={4}
                value={form.benefits}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none resize-y focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
                placeholder="Bolsa auxílio R$ 1.800&#10;Vale transporte&#10;Vale refeição&#10;Horário flexível&#10;Mentoria técnica"
              />
              <p className="mt-1 text-xs text-gray-500">Separe cada benefício com Enter</p>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 px-6 py-3 font-medium rounded-lg disabled:opacity-50 transition-colors hover:bg-[${PRIMARY_DARK}]`} style={{backgroundColor: PRIMARY, color: 'white'}}
              >
                {submitting ? 'Publicando...' : 'Publicar Oportunidade'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/minhas-oportunidades')}
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