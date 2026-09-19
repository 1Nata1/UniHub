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
  accepted: 'Aceito',
  rejected: 'Recusado',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
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

  const filteredApplications = useMemo(() => {
    return applications.filter(app => statusFilter === 'all' || app.status === statusFilter);
  }, [applications, statusFilter]);

  const handleStatusChange = async (studentId, newStatus) => {
    await updateApplicationStatus(studentId, opportunityId, newStatus);
    // Force re-render by using window.location.reload() since we're using localStorage
    window.location.reload();
  };

  if (!opportunity) return <div className="min-h-screen flex items-center justify-center"><p>Oportunidade não encontrada</p></div>;

  return (
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
              {['all', 'pending', 'accepted', 'rejected'].map(status => (
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

                    {app.status === 'pending' && (
                      <div className="flex gap-2 pt-4 border-t border-gray-100">
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
                      </div>
                    )}
                    {app.status !== 'pending' && (
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                          Status alterado para <strong>{statusLabels[app.status]}</strong> em {new Date().toLocaleDateString('pt-BR')}
                        </p>
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
  );
}