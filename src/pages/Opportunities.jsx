import { useState, useMemo, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { SkeletonOpportunityCard, SkeletonDetail } from '../components/Skeleton';

const PRIMARY = '#002F85';
const PRIMARY_DARK = '#00256e';
const PRIMARY_LIGHT = '#e8effd';
const PRIMARY_BORDER = '#c5d8fb';

const typeLabels = {
  estagio: 'Estágio',
  projeto: 'Projeto',
  vaga: 'Vaga',
};

const typeColors = {
  estagio: 'bg-green-100 text-green-700',
  projeto: 'bg-blue-100 text-blue-700',
  vaga: 'bg-yellow-100 text-yellow-700',
};

const typeBgColors = {
  estagio: 'bg-green-50 border-green-100',
  projeto: 'bg-blue-50 border-blue-100',
  vaga: 'bg-yellow-50 border-yellow-100',
};

export default function Opportunities() {
  const { user } = useAuth();
  const { opportunities } = useData();
  const params = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter(o => o.active)
      .filter(o => {
        if (search) {
          const s = search.toLowerCase();
          return o.title.toLowerCase().includes(s) ||
                 o.company.toLowerCase().includes(s) ||
                 o.description.toLowerCase().includes(s);
        }
        return true;
      })
      .filter(o => typeFilter === 'all' || o.type === typeFilter)
      .filter(o => !locationFilter || o.location.toLowerCase().includes(locationFilter.toLowerCase()));
  }, [opportunities, search, typeFilter, locationFilter]);

  if (params.id) return <OpportunityDetail opportunityId={params.id} />;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Oportunidades</h1>
            <p className="text-gray-600 mt-1">Encontre estágios, projetos e vagas ideais para você</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Carregando oportunidades">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonOpportunityCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Oportunidades</h1>
            <p className="text-gray-600 mt-1">Encontre estágios, projetos e vagas ideais para você</p>
          </div>
          {user?.type !== 'student' && (
            <Link to="/nova-oportunidade" className={`px-4 py-2 text-white font-medium rounded-lg hover:bg-[${PRIMARY_DARK}] transition-colors w-full sm:w-auto text-center`} style={{backgroundColor: PRIMARY}}>
              + Nova Oportunidade
            </Link>
          )}
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por título, empresa, descrição..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
              />
            </div>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className={`px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
            >
              <option value="all">Todos os tipos</option>
              <option value="estagio">Estágio</option>
              <option value="projeto">Projeto</option>
              <option value="vaga">Vaga</option>
            </select>
            <input
              type="text"
              placeholder="Filtrar por localização..."
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
              className={`px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {filteredOpportunities.length > 0 ? (
              <div className="space-y-4" role="list" aria-label="Lista de oportunidades">
                {filteredOpportunities.map(opp => (
                  <article key={opp.id} className={`rounded-xl p-5 border hover:shadow-md transition-all ${typeBgColors[opp.type] || 'bg-gray-50 border-gray-100'}`} role="listitem">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${typeColors[opp.type]} capitalize`}>
                          {typeLabels[opp.type]}
                        </span>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                          {opp.workload}
                        </span>
                      </div>
                      {user?.type !== 'student' && user?.id === opp.companyId && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/editar-oportunidade/${opp.id}`)}
                            className={`px-3 py-1 text-xs font-medium hover:text-[${PRIMARY_DARK}]`} style={{color: PRIMARY}}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => { /* toggle */ }}
                            className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-700"
                          >
                            {opp.active ? 'Desativar' : 'Ativar'}
                          </button>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{opp.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      {opp.company}
                    </p>
                    <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L12 22.314l-5.657-5.657M12 22.314V4.314" /></svg>
                      {opp.location}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{opp.description}</p>
                    <Link to={`/oportunidades/${opp.id}`} className={`text-sm font-medium flex items-center gap-1 hover:text-[${PRIMARY_DARK}]`} style={{color: PRIMARY}}>
                      Ver detalhes <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma oportunidade encontrada</h3>
                <p className="text-gray-500">Tente ajustar os filtros ou buscar por outros termos.</p>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-xl p-5 border border-gray-100 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Estatísticas</h3>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Total ativas</dt>
                  <dd className="font-semibold text-gray-900">{opportunities.filter(o => o.active).length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Estágios</dt>
                  <dd className="font-semibold text-gray-900">{opportunities.filter(o => o.active && o.type === 'estagio').length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Projetos</dt>
                  <dd className="font-semibold text-gray-900">{opportunities.filter(o => o.active && o.type === 'projeto').length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Vagas</dt>
                  <dd className="font-semibold text-gray-900">{opportunities.filter(o => o.active && o.type === 'vaga').length}</dd>
                </div>
              </dl>
              <hr className="my-4 border-gray-100" />
              <p className="text-sm text-gray-500">Dados atualizados em tempo real. Apenas oportunidades ativas são exibidas.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function OpportunityDetail({ opportunityId }) {
  const { opportunities } = useData();
  const { user, applyForOpportunity } = useAuth();
  const opportunity = opportunities.find(o => o.id === opportunityId);

  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  if (!opportunity) return <div className="min-h-screen flex items-center justify-center"><p>Oportunidade não encontrada</p></div>;

  const isOwnApplication = user?.type === 'student' && user.applications?.some(a => a.opportunityId === opportunityId);
  const isOwnCompany = user?.type !== 'student' && user?.id === opportunity.companyId;

  const handleApply = async () => {
    if (!user || user.type !== 'student') return;
    setApplying(true);
    const success = await applyForOpportunity(opportunityId);
    if (success) setApplied(true);
    setApplying(false);
  };

  if (!opportunity) return <div className="min-h-screen flex items-center justify-center"><p>Oportunidade não encontrada</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/oportunidades" className={`inline-flex items-center gap-1 text-sm font-medium mb-6 hover:text-[${PRIMARY_DARK}]`} style={{color: PRIMARY}}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Voltar
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${typeColors[opportunity.type]} capitalize`}>
                {typeLabels[opportunity.type]}
              </span>
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700">
                {opportunity.workload}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{opportunity.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <span>{opportunity.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L12 22.314l-5.657-5.657M12 22.314V4.314" /></svg>
                <span>{opportunity.location}</span>
              </div>
            </div>

            <div className="prose max-w-none mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Descrição</h2>
              <p className="text-gray-600 whitespace-pre-line">{opportunity.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Requisitos</h2>
                <ul className="space-y-1">
                  {opportunity.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Benefícios</h2>
                <ul className="space-y-1">
                  {opportunity.benefits.map((ben, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5" style={{color: PRIMARY}} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      {ben}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {user?.type === 'student' && (
              <div className="pt-6 border-t border-gray-100">
                {isOwnApplication ? (
                  <div className="text-center py-4">
                    <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <p className="text-green-700 font-medium text-lg mb-2">Você já se candidatou! ✓</p>
                    <p className="text-gray-600 text-sm">A empresa será notificada e poderá visualizar seu perfil completo.</p>
                  </div>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className={`w-full sm:w-auto px-6 py-3 font-medium rounded-lg transition-colors hover:bg-[${PRIMARY_DARK}] disabled:opacity-50`} style={{backgroundColor: PRIMARY, color: 'white'}}
                  >
                    {applying ? 'Candidatando...' : 'Candidatar-se'}
                  </button>
                )}
              </div>
            )}

            {isOwnCompany && (
              <div className="pt-6 border-t border-gray-100 flex gap-3">
                <Link to={`/editar-oportunidade/${opportunity.id}`} className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  Editar
                </Link>
                <Link to={`/candidaturas/${opportunity.id}`} className={`px-4 py-2 font-medium rounded-lg transition-colors hover:bg-[${PRIMARY_DARK}]`} style={{backgroundColor: PRIMARY, color: 'white'}}>
                  Ver Candidaturas
                </Link>
                <button className="px-4 py-2 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors">
                  Excluir
                </button>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}