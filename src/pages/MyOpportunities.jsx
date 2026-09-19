import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

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
  estagio: `bg-[${PRIMARY_LIGHT}] text-[${PRIMARY_DARK}]`,
  projeto: 'bg-blue-100 text-blue-700',
  vaga: 'bg-green-100 text-green-700',
};

export default function MyOpportunities() {
  const { user } = useAuth();
  const { opportunities, toggleOpportunity } = useData();
  const navigate = useNavigate();

  if (!user || user.type === 'student') return navigate('/');

  const myOpportunities = opportunities.filter(o => o.companyId === user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minhas Oportunidades</h1>
            <p className="text-gray-600 mt-1">Gerencie suas vagas, estágios e projetos publicados</p>
          </div>
          <Link to="/nova-oportunidade" className={`px-4 py-2 font-medium rounded-lg hover:bg-[${PRIMARY_DARK}] transition-colors w-full sm:w-auto text-center`} style={{backgroundColor: PRIMARY, color: 'white'}}>
            + Nova Oportunidade
          </Link>
        </div>

        {myOpportunities.length > 0 ? (
          <div className="space-y-4" role="list" aria-label="Minhas oportunidades">
            {myOpportunities.map(opp => (
              <article key={opp.id} className={`bg-white rounded-xl p-5 border border-gray-100 hover:border-[${PRIMARY_BORDER}] hover:shadow-md transition-all`} role="listitem">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${typeColors[opp.type]} capitalize`}>
                        {typeLabels[opp.type]}
                      </span>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        {opp.workload}
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${opp.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {opp.active ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{opp.title}</h3>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L12 22.314l-5.657-5.657M12 22.314V4.314" /></svg>
                      {opp.location}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2">{opp.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/oportunidades/${opp.id}`} className={`px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors hover:bg-[${PRIMARY_LIGHT}]`} style={{color: PRIMARY, borderColor: PRIMARY_BORDER}}>
                      Ver
                    </Link>
                    <Link to={`/editar-oportunidade/${opp.id}`} className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      Editar
                    </Link>
                    <button
                      onClick={() => toggleOpportunity(opp.id)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        opp.active
                          ? 'text-orange-600 border border-orange-200 hover:bg-orange-50'
                          : 'text-green-600 border border-green-200 hover:bg-green-50'
                      }`}
                    >
                      {opp.active ? 'Desativar' : 'Ativar'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma oportunidade publicada</h3>
            <p className="text-gray-500 mb-6">Comece publicando sua primeira vaga, estágio ou projeto.</p>
            <Link to="/nova-oportunidade" className={`inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors hover:bg-[${PRIMARY_DARK}]`} style={{backgroundColor: PRIMARY, color: 'white'}}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Publicar primeira oportunidade
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}