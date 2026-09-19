import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('conectauni_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password, type) => {
    await new Promise(r => setTimeout(r, 500));
    const users = JSON.parse(localStorage.getItem('conectauni_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password && u.type === type);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('conectauni_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = async (data) => {
    await new Promise(r => setTimeout(r, 500));
    const users = JSON.parse(localStorage.getItem('conectauni_users') || '[]');
    if (users.find(u => u.email === data.email)) {
      return false;
    }
    const newUser = { 
      ...data, 
      id: crypto.randomUUID(),
      age: data.type === 'student' ? (data.age || '') : undefined,
      semester: data.type === 'student' ? (data.semester || '') : undefined,
      externalCourses: data.type === 'student' ? (data.externalCourses || '') : undefined,
      competencies: data.type === 'student' ? (data.competencies || '') : undefined,
      companyDescription: data.type !== 'student' ? (data.companyDescription || '') : undefined,
      website: data.type !== 'student' ? (data.website || '') : undefined,
      linkedin: data.type !== 'student' ? (data.linkedin || '') : undefined,
      registeredEvents: data.type === 'student' ? [] : undefined,
      applications: data.type === 'student' ? [] : undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };
    users.push(newUser);
    localStorage.setItem('conectauni_users', JSON.stringify(users));
    const { password: _, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem('conectauni_user', JSON.stringify(userData));
    return true;
  };

  const updateProfile = async (updates) => {
    await new Promise(r => setTimeout(r, 300));
    const users = JSON.parse(localStorage.getItem('conectauni_users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex === -1) return false;
    
    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem('conectauni_users', JSON.stringify(users));
    
    const { password: _, ...userData } = users[userIndex];
    setUser(userData);
    localStorage.setItem('conectauni_user', JSON.stringify(userData));
    return true;
  };

  const applyForOpportunity = async (opportunityId) => {
    if (!user || user.type !== 'student') return false;
    await new Promise(r => setTimeout(r, 300));
    const users = JSON.parse(localStorage.getItem('conectauni_users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex === -1) return false;
    
    const applications = users[userIndex].applications || [];
    if (!applications.some(a => a.opportunityId === opportunityId)) {
      applications.push({
        opportunityId,
        appliedAt: new Date().toISOString(),
        status: 'pending',
      });
      users[userIndex] = { ...users[userIndex], applications };
      localStorage.setItem('conectauni_users', JSON.stringify(users));
      
      const { password: _, ...userData } = users[userIndex];
      setUser(userData);
      localStorage.setItem('conectauni_user', JSON.stringify(userData));
    }
    return true;
  };

  const getApplicationsForOpportunity = (opportunityId) => {
    const users = JSON.parse(localStorage.getItem('conectauni_users') || '[]');
    const applications = [];
    users.forEach(u => {
      if (u.type === 'student' && u.applications) {
        u.applications.forEach(app => {
          if (app.opportunityId === opportunityId) {
            applications.push({
              student: {
                id: u.id,
                name: u.name,
                email: u.email,
                age: u.age,
                semester: u.semester,
                externalCourses: u.externalCourses,
                competencies: u.competencies,
                github: u.github,
              },
              appliedAt: app.appliedAt,
              status: app.status,
            });
          }
        });
      }
    });
    return applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
  };

  const updateApplicationStatus = async (studentId, opportunityId, status) => {
    await new Promise(r => setTimeout(r, 300));
    const users = JSON.parse(localStorage.getItem('conectauni_users') || '[]');
    const studentIndex = users.findIndex(u => u.id === studentId);
    if (studentIndex === -1) return false;
    
    const applications = users[studentIndex].applications || [];
    const appIndex = applications.findIndex(a => a.opportunityId === opportunityId);
    if (appIndex === -1) return false;
    
    applications[appIndex] = { ...applications[appIndex], status };
    users[studentIndex] = { ...users[studentIndex], applications };
    localStorage.setItem('conectauni_users', JSON.stringify(users));
    
    if (user.id === studentId) {
      const { password: _, ...userData } = users[studentIndex];
      setUser(userData);
      localStorage.setItem('conectauni_user', JSON.stringify(userData));
    }
    return true;
  };

  const registerForEvent = async (eventId) => {
    if (!user || user.type !== 'student') return false;
    await new Promise(r => setTimeout(r, 300));
    const users = JSON.parse(localStorage.getItem('conectauni_users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex === -1) return false;
    
    const registeredEvents = users[userIndex].registeredEvents || [];
    if (!registeredEvents.includes(eventId)) {
      registeredEvents.push(eventId);
      users[userIndex] = { ...users[userIndex], registeredEvents };
      localStorage.setItem('conectauni_users', JSON.stringify(users));
      
      const { password: _, ...userData } = users[userIndex];
      setUser(userData);
      localStorage.setItem('conectauni_user', JSON.stringify(userData));
    }
    return true;
  };

  const unregisterFromEvent = async (eventId) => {
    if (!user || user.type !== 'student') return false;
    await new Promise(r => setTimeout(r, 300));
    const users = JSON.parse(localStorage.getItem('conectauni_users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex === -1) return false;
    
    const registeredEvents = (users[userIndex].registeredEvents || []).filter(id => id !== eventId);
    users[userIndex] = { ...users[userIndex], registeredEvents };
    localStorage.setItem('conectauni_users', JSON.stringify(users));
    
    const { password: _, ...userData } = users[userIndex];
    setUser(userData);
    localStorage.setItem('conectauni_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('conectauni_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading,
      updateProfile,
      registerForEvent,
      unregisterFromEvent,
      applyForOpportunity,
      getApplicationsForOpportunity,
      updateApplicationStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}