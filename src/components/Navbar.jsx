import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PRIMARY = '#002F85';
const PRIMARY_DARK = '#00256e';
const PRIMARY_LIGHT = '#e8effd';
const PRIMARY_LIGHTER = '#f0f5fa';
const PRIMARY_BORDER = '#c5d8fb';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { opportunities, events } = useData();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authType, setAuthType] = useState('student');

  const navLinks = user?.type === 'student' ? [
    { path: '/', label: 'Início' },
    { path: '/oportunidades', label: 'Oportunidades' },
    { path: '/eventos', label: 'Eventos' },
    { path: '/perfil', label: 'Meu Perfil' },
  ] : user?.type === 'company' || user?.type === 'professor' ? [
    { path: '/', label: 'Início' },
    { path: '/minhas-oportunidades', label: 'Minhas Oportunidades' },
    { path: '/meus-eventos', label: 'Meus Eventos' },
    { path: '/candidaturas', label: 'Candidaturas' },
    { path: '/nova-oportunidade', label: 'Nova Oportunidade' },
    { path: '/novo-evento', label: 'Novo Evento' },
    { path: '/perfil', label: 'Meu Perfil' },
  ] : [
    { path: '/', label: 'Início' },
    { path: '/oportunidades', label: 'Oportunidades' },
    { path: '/eventos', label: 'Eventos' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navegação principal">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className={`text-xl font-bold transition-colors hover:text-[${PRIMARY_DARK}]`} style={{color: PRIMARY}} aria-label="ConectaUni - Página inicial">
              ConectaUni
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-[${PRIMARY}] ${
                    location.pathname === link.path
                      ? `text-[${PRIMARY}]`
                      : 'text-gray-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize bg-[${PRIMARY_LIGHT}] text-[${PRIMARY_DARK}]`}>
                    {user.type === 'student' ? 'Aluno' : user.type === 'company' ? 'Empresa' : 'Professor'}
                  </span>
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors hover:bg-[${PRIMARY_DARK}]`} style={{backgroundColor: PRIMARY}}
              >
                Entrar / Cadastrar
              </button>
            )}

            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Abrir menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    location.pathname === link.path
                      ? `bg-[${PRIMARY_LIGHTER}] text-[${PRIMARY}]`
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <button
                  onClick={() => { setAuthMode('login'); setShowAuthModal(true); setMobileMenuOpen(false); }}
                  className={`mt-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-[${PRIMARY_DARK}]`} style={{backgroundColor: PRIMARY}}
                >
                  Entrar / Cadastrar
                </button>
              )}
            </div>
          </div>
        )}

        {showAuthModal && (
          <AuthModal
            mode={authMode}
            initialType={authType}
            onModeChange={setAuthMode}
            onTypeChange={setAuthType}
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </nav>
    </header>
  );
}

function AuthModal({ mode, initialType, onModeChange, onTypeChange, onClose }) {
  const { login, register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [course, setCourse] = useState('');
  const [type, setType] = useState(initialType);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('As senhas não coincidem');
        setLoading(false);
        return;
      }
      const success = await register({ name, email, password, type, companyName, course });
      if (success) onClose();
      else setError('Email já cadastrado');
    } else {
      const success = await login(email, password, type);
      if (success) onClose();
      else setError('Credenciais inválidas');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 id="auth-title" className="text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Fechar">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6" role="tablist" aria-label="Tipo de conta">
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
            <button
              role="tab"
              aria-selected={type === 'student'}
              onClick={() => { onTypeChange('student'); setType('student'); }}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                type === 'student' ? `bg-white text-[${PRIMARY}] shadow` : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Aluno
            </button>
            <button
              role="tab"
              aria-selected={type === 'company'}
              onClick={() => { onTypeChange('company'); setType('company'); }}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                type === 'company' ? `bg-white text-[${PRIMARY}] shadow` : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Empresa/Professor
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
                placeholder="Seu nome"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
              placeholder="••••••••"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
                placeholder="••••••••"
              />
            </div>
          )}

          {type === 'company' && mode === 'register' && (
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Nome da empresa/instituição
              </label>
              <input
                id="companyName"
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
                placeholder="Ex: TechCorp Ltda / Universidade Federal"
              />
            </div>
          )}

          {type === 'student' && mode === 'register' && (
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                Curso
              </label>
              <input
                id="course"
                type="text"
                value={course}
                onChange={e => setCourse(e.target.value)}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:border-[${PRIMARY}]`} style={{focusRingColor: PRIMARY}}
                placeholder="Ex: Ciência da Computação"
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-[${PRIMARY_DARK}]`} style={{backgroundColor: PRIMARY}}
          >
            {loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'} {' '}
          <button
            onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
            className={`font-medium hover:text-[${PRIMARY_DARK}]`} style={{color: PRIMARY}}
          >
            {mode === 'login' ? 'Cadastrar' : 'Entrar'}
          </button>
        </p>
      </div>
    </div>
  );
}