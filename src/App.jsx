import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Opportunities from './pages/Opportunities';
import Events from './pages/Events';
import NewOpportunity from './pages/NewOpportunity';
import NewEvent from './pages/NewEvent';
import MyOpportunities from './pages/MyOpportunities';
import MyEvents from './pages/MyEvents';
import Profile from './pages/Profile';
import Applications from './pages/Applications';
import './App.css';

function PrivateRoute({ children, allowedTypes }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" aria-label="Carregando" style={{borderColor: '#002F85'}} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedTypes && !allowedTypes.includes(user.type)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/oportunidades" element={<Opportunities />} />
      <Route path="/oportunidades/:id" element={<Opportunities />} />
      <Route path="/eventos" element={<Events />} />
      <Route path="/eventos/:id" element={<Events />} />

      <Route
        path="/nova-oportunidade"
        element={
          <PrivateRoute allowedTypes={['company', 'professor']}>
            <NewOpportunity />
          </PrivateRoute>
        }
      />
      <Route
        path="/novo-evento"
        element={
          <PrivateRoute allowedTypes={['company', 'professor']}>
            <NewEvent />
          </PrivateRoute>
        }
      />
      <Route
        path="/minhas-oportunidades"
        element={
          <PrivateRoute allowedTypes={['company', 'professor']}>
            <MyOpportunities />
          </PrivateRoute>
        }
      />
      <Route
        path="/meus-eventos"
        element={
          <PrivateRoute allowedTypes={['company', 'professor']}>
            <MyEvents />
          </PrivateRoute>
        }
      />
      <Route
        path="/candidaturas"
        element={
          <PrivateRoute allowedTypes={['company', 'professor']}>
            <Applications />
          </PrivateRoute>
        }
      />
      <Route
        path="/candidaturas/:id"
        element={
          <PrivateRoute allowedTypes={['company', 'professor']}>
            <Applications />
          </PrivateRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>UniHub - Conectando estudantes a oportunidades</p>
          <p className="mt-1">Desenvolvido para a comunidade universitária</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppLayout />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}