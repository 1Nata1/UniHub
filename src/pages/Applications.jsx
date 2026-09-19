import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Link, useParams } from 'react-router-dom';

const PRIMARY = '#002F85';
const PRIMARY_DARK = '#00256e';
const PRIMARY_LIGHT = '#e8effd';
const PRIMARY_BORDER = '#c5d8fb';

const statusLabels = {
  pending: 'Pendente',
  interview: 'Entrevista Agendada',
  accepted: 'Aceito',
  rejected: 'Recusado',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  interview: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function Applications() {
  const { user, getApplicationsForOpportunity, updateApplicationStatus } = useAuth();
  const { opportunities } = useData();
  const params = useParams();

  if (!user || user.type === 'student') return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Acesso restrito para empresas</p></div>;

  if (params.id) return <ApplicationDetail opportunityId={params.id} />;

  const myOpportunities = opportunities.filter(o => o.companyId === user.id);

  const opportunitiesWithApplications = useMemo(() => {
    return myOpportunities.map(opp => {
      const applications = getApplicationsForOpportunity(opp.id);
      return { ...opp, applications, applicationsCount: applications.length };
    }).filter(opp => opp.applicationsCount > 0);
  }, [myOpportunities, getApplicationsForOpportunity]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Candidaturas Recebidas</h1>
          <p className="text-gray-600 mt-1">Gerencie as candidaturas para suas oportunidades</p>
        </div>

        {opportunitiesWithApplications.length > 0 ? (
          <div className="space-y-6" role="list">
            {opportunitiesWithApplications.map(opp => (
              <article key={opp.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{opp.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{opp.company} • {opp.typeLabels?.[opp.type] || opp.type}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${opp.applicationsCount > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {opp.applicationsCount} candidaturas
                    </span>
                  </div>
                  <Link to={`/candidaturas/${opp.id}`} className={`inline-flex items-center gap-1 text-sm font-medium transition-colors hover:bg-[${PRIMARY_LIGHT}]`} style={{color: PRIMARY, borderColor: PRIMARY_BORDER}}>
                    Ver detalhes <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma candidatura recebida</h3>
            <p className="text-gray-500 mb-6">Quando estudantes se candidatarem às suas oportunidades, elas aparecerão aqui.</p>
            <Link to="/minhas-oportunidades" className={`inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors hover:bg-[${PRIMARY_DARK}]`} style={{backgroundColor: PRIMARY, color: 'white'}}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Ver minhas oportunidades
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function ApplicationDetail({ opportunityId }) {
  const { opportunities } = useData();
  const { user, getApplicationsForOpportunity, updateApplicationStatus } = useAuth();
  const opportunity = opportunities.find(o => o.id === opportunityId);

  if (!opportunity) return <div className="min-h-screen flex items-center justify-center"><p>Oportunidade não encontrada</p></div>;

  const applications = getApplicationsForOpportunity(opportunityId);

  const [statusFilter, setStatusFilter] = useState('all');
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    date: '',
    time: '09:00',
    location: '',
    notes: '',
  });

  const filteredApplications = useMemo(() => {
    return applications.filter(app => statusFilter === 'all' || app.status === statusFilter);
  }, [applications, statusFilter]);

  const handleStatusChange = async (studentId, newStatus) => {
    await updateApplicationStatus(studentId, opportunityId, newStatus);
    window.location.reload();
  };

  const openInterviewModal = (app) => {
    setSelectedApplication(app);
    setInterviewForm({ date: '', time: '09:00', location: '', notes: '' });
    setShowInterviewModal(true);
  };

  const handleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApplication) return;
    
    await updateApplicationStatus(selectedApplication.student.id, opportunityId, 'interview');
    
    // Store interview details in localStorage
    const interviews = JSON.parse(localStorage.getItem('conectauni_interviews') || '{}');
    if (!interviews[opportunityId]) interviews[opportunityId] = {};
    interviews[opportunityId][selectedApplication.student.id] = {
      ...interviewForm,
      scheduledAt: new Date().toISOString(),
    };
    localStorage.setItem('conectauni_interviews', JSON.stringify(interviews));
    
    setShowInterviewModal(false);
    window.location.reload();
  };

  if (!opportunity) return <div className="min-h-screen flex items-center justify-center"><p>Oportunidade não encontrada</p></div>;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/candidaturas" className={`inline-flex items-center gap-1 text-sm font-medium mb-6 hover:text-[${PRIMARY_DARK}]`} style={{color: PRIMARY}}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Voltar
        </Link>

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{opportunity.title}</h1>
              <p className="text-gray-600 mt-1">Candidaturas para esta oportunidade</p>
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'accepted', 'rejected', 'interview'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    statusFilter === status
                      ? `bg-[${PRIMARY}] text-white`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'Todas' : statusLabels[status]}
                </button>
              ))}
            </div>
          </div>

          {filteredApplications.length > 0 ? (
            <div className="space-y-4" role="list">
              {filteredApplications.map((app, index) => (
                <article key={app.student.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden" role="listitem">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xl font-semibold text-gray-500">
                            {app.student.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{app.student.name}</h3>
                          <p className="text-sm text-gray-500">{app.student.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[app.status]}`}>
                          {statusLabels[app.status]}
                        </span>
                        <time className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                          {new Date(app.appliedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </time>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Idade</h4>
                        <p className="text-gray-600">{app.student.age || 'Não informado'}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Semestre</h4>
                        <p className="text-gray-600">{app.student.semester || 'Não informado'}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Cursos Extras</h4>
                      <p className="text-gray-600 whitespace-pre-line">{app.student.externalCourses || 'Nenhum curso informado'}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Competências</h4>
                      <p className="text-gray-600 whitespace-pre-line">{app.student.competencies || 'Nenhuma competência informada'}</p>
                    </div>

                    {app.student.github && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">GitHub</h4>
                        <a href={app.student.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline break-all">
                          {app.student.github}
                        </a>
                      </div>
                    )}

                    {app.status === 'pending' && (
                      <div className="flex gap-2 pt-4 border-t border-gray-100 flex-wrap">
                        <button
                          onClick={() => handleStatusChange(app.student.id, 'accepted')}
                          className={`px-4 py-2 font-medium rounded-lg transition-colors hover:bg-green-700`} style={{backgroundColor: '#10b981', color: 'white'}}
                        >
                          Aceitar
                        </button>
                        <button
                          onClick={() => handleStatusChange(app.student.id, 'rejected')}
                          className="px-4 py-2 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Recusar
                        </button>
                        <button
                          onClick={() => openInterviewModal(app)}
                          className={`px-4 py-2 font-medium rounded-lg transition-colors hover:bg-blue-700`} style={{backgroundColor: '#3b82f6', color: 'white'}}
                        >
                          Agendar Entrevista
                        </button>
                      </div>
                    )}
                    {app.status !== 'pending' && (
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                          Status alterado para <strong>{statusLabels[app.status]}</strong> em {new Date().toLocaleDateString('pt-BR')}
                        </p>
                        {app.status === 'interview' && app.interview && (
                          <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-2">📅 Entrevista Agendada</h4>
                            <p><strong>Data:</strong> {new Date(app.interview.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                            <p><strong>Horário:</strong> {app.interview.time}</p>
                            <p><strong>Local:</strong> {app.interview.location}</p>
                            {app.interview.notes && <p><strong>Observações:</strong> {app.interview.notes}</p>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">{statusFilter === 'all' ? 'Nenhuma candidatura' : `Nenhuma candidatura ${statusLabels[statusFilter]}`}</h3>
              <p className="text-gray-500">Tente ajustar o filtro de status.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    {showInterviewModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-labelledby="interview-title">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 id="interview-title" className="text-2xl font-bold text-gray-900">Agendar Entrevista</h2>
            <button onClick={() => { setShowInterviewModal(false); setSelectedApplication(null); }} className="text-gray-400 hover:text-gray-600" aria-label="Fechar">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-gray-600 mb-6">Agendar entrevista para <strong>{selectedApplication?.student?.name}</strong></p>

          <form onSubmit={handleInterviewSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="interviewDate" className="block text-sm font-medium text-gray-700 mb-1">
                Data <span className="text-red-500">*</span>
              </label>
              <input
                id="interviewDate"
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={interviewForm.date}
                onChange={e => setInterviewForm(prev => ({ ...prev, date: e.target.value }))}
                className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}] ${!interviewForm.date ? 'border-red-300' : 'border-gray-300'}`}
              />
            </div>

            <div>
              <label htmlFor="interviewTime" className="block text-sm font-medium text-gray-700 mb-1">
                Horário <span className="text-red-500">*</span>
              </label>
              <input
                id="interviewTime"
                type="time"
                required
                value={interviewForm.time}
                onChange={e => setInterviewForm(prev => ({ ...prev, time: e.target.value }))}
                className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}]`}
              />
            </div>

            <div>
              <label htmlFor="interviewLocation" className="block text-sm font-medium text-gray-700 mb-1">
                Local <span className="text-red-500">*</span>
              </label>
              <input
                id="interviewLocation"
                type="text"
                required
                value={interviewForm.location}
                onChange={e => setInterviewForm(prev => ({ ...prev, location: e.target.value }))}
                className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}] ${!interviewForm.location ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Ex: Presencial - Sala 101 / Online - Google Meet"
              />
            </div>

            <div>
              <label htmlFor="interviewNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                id="interviewNotes"
                rows={3}
                value={interviewForm.notes}
                onChange={e => setInterviewForm(prev => ({ ...prev, notes: e.target.value }))}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none resize-y focus:ring-2 focus:border-[${PRIMARY}]`}
                placeholder="Detalhes adicionais sobre a entrevista..."
              />
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                type="submit"
                className={`flex-1 px-4 py-3 font-medium rounded-lg transition-colors hover:bg-blue-700`} style={{backgroundColor: '#3b82f6', color: 'white'}}
              >
                Confirmar Entrevista
              </button>
              <button
                type="button"
                onClick={() => { setShowInterviewModal(false); setSelectedApplication(null); }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
}