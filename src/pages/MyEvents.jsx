import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const PRIMARY = '#002F85';
const PRIMARY_DARK = '#00256e';
const PRIMARY_LIGHT = '#e8effd';
const PRIMARY_BORDER = '#c5d8fb';

const eventTypeLabels = {
  palestra: 'Palestra',
  workshop: 'Workshop',
  feira: 'Feira',
  outro: 'Outro',
};

const eventTypeColors = {
  palestra: 'bg-blue-100 text-blue-700',
  workshop: `bg-[${PRIMARY_LIGHT}] text-[${PRIMARY_DARK}]`,
  feira: 'bg-orange-100 text-orange-700',
  outro: 'bg-gray-100 text-gray-700',
};

export default function MyEvents() {
  const { user } = useAuth();
  const { events, toggleEvent } = useData();
  const navigate = useNavigate();

  if (!user || user.type === 'student') return navigate('/');

  const myEvents = events.filter(e => e.organizerId === user.id);

  const sortEvents = [...myEvents].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Eventos</h1>
            <p className="text-gray-600 mt-1">Gerencie palestras, workshops e feiras criadas</p>
          </div>
          <Link to="/novo-evento" className={`px-4 py-2 font-medium rounded-lg hover:bg-[${PRIMARY_DARK}] transition-colors w-full sm:w-auto text-center`} style={{backgroundColor: PRIMARY, color: 'white'}}>
            + Novo Evento
          </Link>
        </div>

        {sortEvents.length > 0 ? (
          <div className="space-y-4" role="list" aria-label="Meus eventos">
            {sortEvents.map(evt => (
              <article key={evt.id} className={`bg-white rounded-xl p-5 border border-gray-100 hover:border-[${PRIMARY_BORDER}] hover:shadow-md transition-all`} role="listitem">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${eventTypeColors[evt.type]} capitalize`}>
                        {eventTypeLabels[evt.type]}
                      </span>
                      <time className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700" dateTime={`${evt.date}T${evt.time}`}>
                        {new Date(evt.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })} às {evt.time}
                      </time>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${evt.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {evt.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{evt.title}</h3>
                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L12 22.314l-5.657-5.657M12 22.314V4.314" /></svg>
                      {evt.location}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        {evt.capacity ? `${evt.registeredCount}/${evt.capacity}` : `${evt.registeredCount}`} inscritos
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/eventos/${evt.id}`} className={`px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors hover:bg-[${PRIMARY_LIGHT}]`} style={{color: PRIMARY, borderColor: PRIMARY_BORDER}}>
                      Ver
                    </Link>
                    <Link to={`/editar-evento/${evt.id}`} className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      Editar
                    </Link>
                    <button
                      onClick={() => toggleEvent(evt.id)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        evt.active
                          ? 'text-orange-600 border border-orange-200 hover:bg-orange-50'
                          : 'text-green-600 border border-green-200 hover:bg-green-50'
                      }`}
                    >
                      {evt.active ? 'Desativar' : 'Ativar'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum evento criado</h3>
            <p className="text-gray-500 mb-6">Comece criando seu primeiro evento para a comunidade.</p>
            <Link to="/novo-evento" className={`inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors hover:bg-[${PRIMARY_DARK}]`} style={{backgroundColor: PRIMARY, color: 'white'}}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Criar primeiro evento
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}