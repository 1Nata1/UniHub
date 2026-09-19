import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Link, useNavigate } from 'react-router-dom';

const PRIMARY = '#002F85';
const PRIMARY_DARK = '#00256e';
const PRIMARY_LIGHT = '#e8effd';
const PRIMARY_BORDER = '#c5d8fb';

export default function Profile() {
  const { user, updateProfile, registerForEvent, unregisterFromEvent } = useAuth();
  const { events } = useData();
  const navigate = useNavigate();

  if (!user) return navigate('/');

  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    age: user.age || '',
    semester: user.semester || '',
    externalCourses: user.externalCourses || '',
    competencies: user.competencies || '',
    companyDescription: user.companyDescription || '',
    website: user.website || '',
    linkedin: user.linkedin || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const success = await updateProfile(form);
    setSaving(false);
    if (success) setSaved(true);
  };

  const registeredEvents = user.registeredEvents || [];
  const eventDetails = registeredEvents
    .map(id => events.find(e => e.id === id))
    .filter(Boolean)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const isStudent = user.type === 'student';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-1">Gerencie suas informações e inscrições</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100">
            <nav className="flex gap-1 px-4" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
                  activeTab === 'profile'
                    ? `border-[${PRIMARY}] text-[${PRIMARY}]`
                    : 'text-gray-500 hover:text-gray-700 border-transparent'
                }`}
              >
                Perfil
              </button>
              {isStudent && (
                <button
                  role="tab"
                  aria-selected={activeTab === 'events'}
                  onClick={() => setActiveTab('events')}
                  className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${
                    activeTab === 'events'
                      ? `border-[${PRIMARY}] text-[${PRIMARY}]`
                      : 'text-gray-500 hover:text-gray-700 border-transparent'
                  }`}
                >
                  Meus Eventos ({user.registeredEvents?.length || 0})
                </button>
              )}
            </nav>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'profile' && (
              <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}]`}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}]`}
                    />
                  </div>
                </div>

                {isStudent ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                          Idade
                        </label>
                        <input
                          id="age"
                          name="age"
                          type="number"
                          min="16"
                          max="100"
                          value={form.age}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}]`}
                          placeholder="Ex: 22"
                        />
                      </div>
                      <div>
                        <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                          Semestre atual
                        </label>
                        <input
                          id="semester"
                          name="semester"
                          type="text"
                          value={form.semester}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}]`}
                          placeholder="Ex: 4º semestre"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="externalCourses" className="block text-sm font-medium text-gray-700 mb-1">
                        Cursos realizados fora da faculdade (um por linha)
                      </label>
                      <textarea
                        id="externalCourses"
                        name="externalCourses"
                        rows={4}
                        value={form.externalCourses}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg outline-none resize-y focus:ring-2 focus:border-[${PRIMARY}]`}
                        placeholder="Curso de Python - Udemy&#10;Inglês Avançado - CCAA&#10;Design UX/UI - Coursera"
                      />
                      <p className="mt-1 text-xs text-gray-500">Separe cada curso com Enter</p>
                    </div>

                    <div>
                      <label htmlFor="competencies" className="block text-sm font-medium text-gray-700 mb-1">
                        Competências / Habilidades (uma por linha)
                      </label>
                      <textarea
                        id="competencies"
                        name="competencies"
                        rows={4}
                        value={form.competencies}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg outline-none resize-y focus:ring-2 focus:border-[${PRIMARY}]`}
                        placeholder="JavaScript, React, Node.js&#10;Python, Pandas, SQL&#10;Git, Docker, AWS&#10;Inglês fluente, Espanhol intermediário"
                      />
                      <p className="mt-1 text-xs text-gray-500">Separe cada competência com Enter ou vírgula</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição da empresa/instituição
                      </label>
                      <textarea
                        id="companyDescription"
                        name="companyDescription"
                        rows={4}
                        value={form.companyDescription}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg outline-none resize-y focus:ring-2 focus:border-[${PRIMARY}]`}
                        placeholder="Descreva sua empresa, área de atuação, missão, valores..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                          Site da empresa
                        </label>
                        <input
                          id="website"
                          name="website"
                          type="url"
                          value={form.website}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}]`}
                          placeholder="https://suaempresa.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                          LinkedIn da empresa
                        </label>
                        <input
                          id="linkedin"
                          name="linkedin"
                          type="url"
                          value={form.linkedin}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}]`}
                          placeholder="https://linkedin.com/company/suaempresa"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex-1 px-6 py-3 font-medium rounded-lg transition-colors hover:bg-[${PRIMARY_DARK}]`} style={{backgroundColor: PRIMARY, color: 'white'}}
                  >
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>

                {saved && (
                  <p className="text-green-600 text-sm text-center">Perfil salvo com sucesso!</p>
                )}
              </form>
            )}

            {activeTab === 'events' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Eventos Inscritos</h2>
                
                {eventDetails.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum evento inscrito</h3>
                    <p className="text-gray-500 mb-6">Você ainda não se inscreveu em nenhum evento.</p>
                    <Link to="/eventos" className={`inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors hover:bg-[${PRIMARY_DARK}]`} style={{backgroundColor: PRIMARY, color: 'white'}}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Ver eventos disponíveis
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4" role="list">
                    {eventDetails.map(evt => (
                      <article key={evt.id} className={`bg-white rounded-xl p-5 border border-gray-100 hover:border-[${PRIMARY_BORDER}] hover:shadow-md transition-all`} role="listitem">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 capitalize">
                                {evt.type === 'palestra' ? 'Palestra' : evt.type === 'workshop' ? 'Workshop' : evt.type === 'feira' ? 'Feira' : 'Outro'}
                              </span>
                              <time className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700" dateTime={`${evt.date}T${evt.time}`}>
                                {new Date(evt.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} às {evt.time}
                              </time>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{evt.title}</h3>
                            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L12 22.314l-5.657-5.657M12 22.314V4.314" /></svg>
                              {evt.location}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                              {evt.organizer}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Link to={`/eventos/${evt.id}`} className={`px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors hover:bg-[${PRIMARY_LIGHT}]`} style={{color: PRIMARY, borderColor: PRIMARY_BORDER}}>
                              Ver detalhes
                            </Link>
                            <button
                              onClick={() => unregisterFromEvent(evt.id)}
                              className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Cancelar inscrição
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}