import { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const PRIMARY = '#002F85';
const PRIMARY_DARK = '#00256e';
const PRIMARY_LIGHT = '#e8effd';
const PRIMARY_LIGHTER = '#f0f5fa';
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

export default function Events() {
  const { user } = useAuth();
  const { events } = useData();
  const params = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('upcoming');

  const filteredEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return events
      .filter(e => e.active)
      .filter(e => {
        if (search) {
          const s = search.toLowerCase();
          return e.title.toLowerCase().includes(s) ||
                 e.organizer.toLowerCase().includes(s) ||
                 e.description.toLowerCase().includes(s);
        }
        return true;
      })
      .filter(e => typeFilter === 'all' || e.type === typeFilter)
      .filter(e => {
        const eventDate = new Date(e.date);
        if (dateFilter === 'upcoming') return eventDate >= now;
        if (dateFilter === 'past') return eventDate < now;
        return true;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, search, typeFilter, dateFilter]);

  if (params.id) return <EventDetail eventId={params.id} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
            <p className="text-gray-600 mt-1">Palestras, workshops, feiras e mais</p>
          </div>
          {user?.type !== 'student' && (
            <Link to="/novo-evento" className={`px-4 py-2 text-white font-medium rounded-lg hover:bg-[${PRIMARY_DARK}] transition-colors w-full sm:w-auto text-center`} style={{backgroundColor: PRIMARY}}>
              + Novo Evento
            </Link>
          )}
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar eventos..."
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
              <option value="palestra">Palestra</option>
              <option value="workshop">Workshop</option>
              <option value="feira">Feira</option>
              <option value="outro">Outro</option>
            </select>
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className={`px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
            >
              <option value="upcoming">Próximos</option>
              <option value="past">Passados</option>
              <option value="all">Todos</option>
            </select>
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Lista de eventos">
            {filteredEvents.map(evt => (
              <article key={evt.id} className={`bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-[${PRIMARY_BORDER}] transition-all`} role="listitem">
                {evt.image && (
                  <img src={evt.image} alt="" className="w-full h-48 object-cover" loading="lazy" />
                )}
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${eventTypeColors[evt.type]} capitalize`}>
                      {eventTypeLabels[evt.type]}
                    </span>
                    <time className="text-xs text-gray-500" dateTime={`${evt.date}T${evt.time}`}>
                      {new Date(evt.date).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </time>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{evt.title}</h3>
                  <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L12 22.314l-5.657-5.657M12 22.314V4.314" /></svg>
                    {evt.location}
                  </p>
                  <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {evt.time}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {evt.capacity ? `${evt.registeredCount}/${evt.capacity} inscritos` : `${evt.registeredCount} inscritos`}
                    </span>
                    <Link to={`/eventos/${evt.id}`} className={`text-sm font-medium hover:text-[${PRIMARY_DARK}]`} style={{color: PRIMARY}}>
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum evento encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou buscar por outros termos.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EventDetail({ eventId }) {
  const { events } = useData();
  const { user, registerForEvent } = useAuth();
  const event = events.find(e => e.id === eventId);

  const [registered, setRegistered] = useState(false);
  const isFull = event?.capacity && event.registeredCount >= event.capacity;
  const eventDate = event?.date ? new Date(event.date) : new Date();
  const isPast = eventDate < new Date();
  const safeType = event?.type || 'outro';
  const typeColor = eventTypeColors[safeType] || 'bg-gray-100 text-gray-700';
  const typeLabel = eventTypeLabels[safeType] || safeType;

  const handleRegister = async () => {
    if (!user || !event) return;
    const success = await registerForEvent(event.id);
    if (success) setRegistered(true);
  };

  if (!event) return <div className="min-h-screen flex items-center justify-center"><p>Evento não encontrado</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/eventos" className={`inline-flex items-center gap-1 text-sm font-medium mb-6 hover:text-[${PRIMARY_DARK}]`} style={{color: PRIMARY}}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Voltar
        </Link>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {event.image && (
            <div className="relative h-80 sm:h-96">
              <img src={event.image} alt={event.title || 'Evento'} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${typeColor} capitalize`}>
                  {typeLabel}
                </span>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-8">
            {!event.image && (
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${typeColor} capitalize`}>
                  {typeLabel}
                </span>
              </div>
            )}

            <header className="mb-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <svg className="w-5 h-5" style={{color: PRIMARY}} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <time dateTime={`${event.date}T${event.time}`}>
                    {eventDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </time>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <svg className="w-5 h-5" style={{color: PRIMARY}} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <svg className="w-5 h-5" style={{color: PRIMARY}} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L12 22.314l-5.657-5.657M12 22.314V4.314" /></svg>
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <svg className="w-5 h-5" style={{color: PRIMARY}} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  <span>{event.organizer}</span>
                </div>
              </div>
            </header>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Sobre o evento</h2>
              <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" style={{color: PRIMARY}} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Informações principais
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Data e horário</dt>
                    <dd className="font-medium text-gray-900">{eventDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} às {event.time}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Local</dt>
                    <dd className="font-medium text-gray-900">{event.location}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Organizador</dt>
                    <dd className="font-medium text-gray-900">{event.organizer}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Tipo</dt>
                    <dd className="font-medium text-gray-900 capitalize">{typeLabel}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Capacidade</dt>
                    <dd className="font-medium text-gray-900">
                      {event.capacity ? `${event.registeredCount} de ${event.capacity} vagas` : `${event.registeredCount} inscritos (ilimitado)`}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Status</dt>
                    <dd className={`font-medium ${isPast ? 'text-gray-500' : isFull ? 'text-red-600' : 'text-green-600'}`}>
                      {isPast ? 'Evento encerrado' : isFull ? 'Lotado' : 'Inscrições abertas'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className={`rounded-xl p-6 border`} style={{backgroundColor: PRIMARY_LIGHTER, borderColor: PRIMARY_BORDER}}>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" style={{color: PRIMARY}} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                  Inscrição
                </h3>
                
                {user?.type === 'student' ? (
                  <>
                    {isPast ? (
                      <div className="text-center py-4">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-gray-600 mb-2">Este evento já aconteceu</p>
                        <button disabled className="w-full px-6 py-3 bg-gray-200 text-gray-500 font-medium rounded-lg cursor-not-allowed">
                          Evento encerrado
                        </button>
                      </div>
                    ) : isFull ? (
                      <div className="text-center py-4">
                        <svg className="w-12 h-12 text-red-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <p className="text-gray-600 mb-2">Evento lotado</p>
                        <button disabled className="w-full px-6 py-3 bg-gray-200 text-gray-500 font-medium rounded-lg cursor-not-allowed">
                          Capacidade esgotada
                        </button>
                      </div>
                    ) : registered ? (
                      <div className="text-center py-4">
                        <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <p className="text-green-700 font-medium text-lg mb-2">Você está inscrito! ✓</p>
                        <p className="text-gray-600 text-sm">Sua vaga está garantida. Lembre-se de comparecer.</p>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-600 mb-4">Garanta sua vaga gratuitamente. Vagas limitadas!</p>
                        <button
                          onClick={handleRegister}
                          className={`w-full px-8 py-4 text-white text-lg font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl hover:bg-[${PRIMARY_DARK}]`} style={{backgroundColor: PRIMARY}}
                        >
                          Inscrever-se Gratuitamente
                        </button>
                        <p className="text-xs text-gray-500 mt-2">Clique para confirmar sua participação</p>
                      </div>
                    )}
                  </>
                ) : user ? (
                  <div className="text-center py-4 text-gray-600">
                    <p>Área restrita para estudantes.</p>
                    <p className="text-sm mt-1">Faça login como aluno para se inscrever.</p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600 mb-4">Faça login para se inscrever neste evento</p>
                    <button onClick={() => document.querySelector('header button')?.click()} className={`px-6 py-3 font-medium rounded-lg transition-colors hover:bg-[${PRIMARY_DARK}]`} style={{backgroundColor: PRIMARY, color: 'white'}}>
                      Entrar / Cadastrar
                    </button>
                  </div>
                )}
              </div>
            </section>

            {user?.type !== 'student' && user?.id === event.organizerId && (
              <div className="pt-6 border-t border-gray-100 flex gap-3">
                <Link to={`/editar-evento/${event.id}`} className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  Editar
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