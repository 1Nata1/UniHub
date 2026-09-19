import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useState, useEffect } from 'react';
import { SkeletonOpportunityCard, SkeletonEventCard } from '../components/Skeleton';

const PRIMARY = '#002F85';
const PRIMARY_DARK = '#00256e';
const PRIMARY_LIGHT = '#e8effd';
const PRIMARY_LIGHTER = '#f0f5fa';
const PRIMARY_BORDER = '#c5d8fb';
const PRIMARY_TEXT_LIGHT = '#dbe8fa';

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

const eventTypeLabels = {
  palestra: 'Palestra',
  workshop: 'Workshop',
  feira: 'Feira',
  outro: 'Outro',
};

export default function Home() {
  const { user } = useAuth();
  const { opportunities, events } = useData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const activeOpportunities = opportunities.filter(o => o.active).slice(0, 3);
  const activeEvents = events.filter(e => e.active).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="relative overflow-hidden" style={{background: `linear-gradient(to bottom right, ${PRIMARY}, ${PRIMARY_DARK}, #1e3a8a)`}}>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
            <div className="max-w-3xl animate-pulse space-y-4">
              <div className="h-8 w-3/4 bg-white/20 rounded" />
              <div className="h-4 w-1/2 bg-white/20 rounded" />
              <div className="h-4 w-1/3 bg-white/20 rounded" />
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 space-y-3">
                <div className="h-10 w-24 bg-gray-200 rounded-xl" />
                <div className="h-6 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white py-16 animate-pulse">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-2">
                <div className="h-6 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-64 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonOpportunityCard key={i} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-16 animate-pulse">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-2">
                <div className="h-6 w-56 bg-gray-200 rounded" />
                <div className="h-4 w-72 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonEventCard key={i} />
              ))}
            </div>
          </div>
        </section>

        <section className="text-white text-center animate-pulse" style={{backgroundColor: PRIMARY}}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="h-8 w-64 bg-white/20 rounded mx-auto mb-4" />
            <div className="h-4 w-80 bg-white/20 rounded mx-auto mb-8" />
            <div className="h-10 w-48 bg-white/20 rounded mx-auto" />
          </div>
        </section>
      </div>
    );
  }

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

  const eventTypeLabels = {
    palestra: 'Palestra',
    workshop: 'Workshop',
    feira: 'Feira',
    outro: 'Outro',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className={`relative overflow-hidden text-white bg-gradient-to-br`} style={{background: `linear-gradient(to bottom right, ${PRIMARY}, ${PRIMARY_DARK}, #1e3a8a)`}}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Sua porta de entrada para <span className="text-yellow-300">oportunidades</span> na universidade
            </h1>
            <p className={`text-lg sm:text-xl mb-8 max-w-2xl`} style={{color: PRIMARY_TEXT_LIGHT}}>
              Centralize vagas de estágio, projetos de pesquisa e eventos acadêmicos em um só lugar. Conecte-se com empresas e professores.
            </p>
            <div className="flex flex-wrap gap-4">
              {user ? (
                <>
                  <Link to={user.type === 'student' ? '/oportunidades' : '/nova-oportunidade'} className={`px-6 py-3 font-medium rounded-lg transition-colors hover:bg-gray-100`} style={{backgroundColor: 'white', color: PRIMARY}}>
                    {user.type === 'student' ? 'Ver Oportunidades' : 'Publicar Oportunidade'}
                  </Link>
                  <Link to={user.type === 'student' ? '/eventos' : '/novo-evento'} className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                    {user.type === 'student' ? 'Ver Eventos' : 'Criar Evento'}
                  </Link>
                </>
              ) : (
                <>
                  <button onClick={() => document.querySelector('header button')?.click()} className={`px-6 py-3 font-medium rounded-lg transition-colors hover:bg-gray-100`} style={{backgroundColor: 'white', color: PRIMARY}}>
                    Começar Agora
                  </button>
                  <Link to="/oportunidades" className="px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                    Explorar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Oportunidades Recentes</h2>
              <p className="text-gray-600 mt-1">Últimas vagas e projetos publicados</p>
            </div>
            <Link to="/oportunidades" className={`font-medium text-sm flex items-center gap-1 hover:text-[${PRIMARY_DARK}]`} style={{color: PRIMARY}}>
              Ver todas <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOpportunities.length > 0 ? (
              activeOpportunities.map(opp => (
                <article key={opp.id} className={`rounded-xl p-5 border hover:shadow-md transition-all ${typeBgColors[opp.type] || 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[opp.type]} capitalize`}>
                      {typeLabels[opp.type]}
                    </span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{opp.workload}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{opp.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L12 22.314l-5.657-5.657M12 22.314V4.314" /></svg>
                    {opp.company}
                  </p>
                  <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L12 22.314l-5.657-5.657M12 22.314V4.314" /></svg>
                    {opp.location}
                  </p>
                  <Link to={`/oportunidades/${opp.id}`} className={`text-sm font-medium flex items-center gap-1 hover:text-[${PRIMARY_DARK}]`} style={{color: PRIMARY}}>
                    Ver detalhes <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Nenhuma oportunidade publicada ainda.</p>
                {user?.type !== 'student' && (
                  <Link to="/nova-oportunidade" className={`mt-4 inline-block px-4 py-2 text-white rounded-lg text-sm hover:bg-[${PRIMARY_DARK}] transition-colors`} style={{backgroundColor: PRIMARY}}>
                    Publicar a primeira
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Próximos Eventos</h2>
              <p className="text-gray-600 mt-1">Palestras, workshops e feiras agendados</p>
            </div>
            <Link to="/eventos" className={`font-medium text-sm flex items-center gap-1 hover:text-[${PRIMARY_DARK}]`} style={{color: PRIMARY}}>
              Ver todos <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeEvents.length > 0 ? (
              activeEvents.map(evt => (
                <article key={evt.id} className={`bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-[${PRIMARY_BORDER}] transition-all`}>
                  {evt.image && (
                    <img src={evt.image} alt="" className="w-full h-40 object-cover" loading="lazy" />
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 capitalize">
                        {eventTypeLabels[evt.type]}
                      </span>
                      <time className="text-xs text-gray-500" dateTime={`${evt.date}T${evt.time}`}>
                        {new Date(evt.date).toLocaleDateString('pt-BR')} às {evt.time}
                      </time>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{evt.title}</h3>
                    <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L12 22.314l-5.657-5.657M12 22.314V4.314" /></svg>
                      {evt.location}
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
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Nenhum evento agendado no momento.</p>
                {user?.type !== 'student' && (
                  <Link to="/novo-evento" className={`mt-4 inline-block px-4 py-2 text-white rounded-lg text-sm hover:bg-[${PRIMARY_DARK}] transition-colors`} style={{backgroundColor: PRIMARY}}>
                    Criar o primeiro evento
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className={`py-16 text-white text-center`} style={{backgroundColor: PRIMARY}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className={`mb-8 max-w-2xl mx-auto`} style={{color: PRIMARY_TEXT_LIGHT}}>Junte-se a milhares de estudantes e empresas conectadas. É gratuito para alunos.</p>
          {!user && (
            <button onClick={() => document.querySelector('header button')?.click()} className={`px-8 py-3 font-medium rounded-lg text-lg transition-colors hover:bg-gray-100`} style={{backgroundColor: 'white', color: PRIMARY}}>
              Criar minha conta grátis
            </button>
          )}
          {user && (
            <Link to={user.type === 'student' ? '/oportunidades' : '/nova-oportunidade'} className={`inline-block px-8 py-3 font-medium rounded-lg text-lg transition-colors hover:bg-gray-100`} style={{backgroundColor: 'white', color: PRIMARY}}>
              {user.type === 'student' ? 'Ver Oportunidades' : 'Publicar Oportunidade'}
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}