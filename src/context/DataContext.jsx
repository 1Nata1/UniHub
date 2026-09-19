import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext(undefined);

const initialOpportunities = [
  {
    id: '1',
    title: 'Estágio em Desenvolvimento Full Stack',
    company: 'TechSolutions Ltda',
    companyId: 'comp1',
    description: 'Buscamos estudante para atuar no desenvolvimento de aplicações web usando React, Node.js e PostgreSQL. Oportunidade de aprender boas práticas de desenvolvimento, testes automatizados e CI/CD.',
    workload: '30h/semana',
    location: 'São Paulo - SP (Híbrido)',
    type: 'estagio',
    requirements: ['Cursando Ciência da Computação ou afins', 'Conhecimento em JavaScript/TypeScript', 'Noções de React e Node.js', 'Git/GitHub'],
    benefits: ['Bolsa auxílio R$ 1.800', 'Vale transporte', 'Vale refeição', 'Horário flexível', 'Mentoria técnica'],
    createdAt: '2024-01-15',
    active: true,
  },
  {
    id: '2',
    title: 'Projeto de Iniciação Científica - IA na Saúde',
    company: 'Universidade Federal - Lab. de IA',
    companyId: 'prof1',
    description: 'Projeto de pesquisa aplicando machine learning para diagnóstico precoce de doenças cardiovasculares. Envolve coleta de dados, treinamento de modelos e publicação de artigo.',
    workload: '20h/semana',
    location: 'Campus Universitário - Presencial',
    type: 'projeto',
    requirements: ['Cursando Engenharia/Computação', 'Python e bibliotecas de ML', 'Estatística básica', 'Inglês técnico'],
    benefits: ['Bolsa CNPq/PIBIC', 'Coautoria em paper', 'Acesso a GPU cluster', 'Certificado de IC'],
    createdAt: '2024-01-10',
    active: true,
  },
  {
    id: '3',
    title: 'Vaga Júnior - Backend Developer',
    company: 'FinTech Innovators',
    companyId: 'comp2',
    description: 'Desenvolvimento de APIs RESTful para sistema de pagamentos. Stack: Go, PostgreSQL, Docker, Kubernetes. Foco em performance e segurança.',
    workload: '40h/semana',
    location: 'Remote (Brasil)',
    type: 'vaga',
    requirements: ['Formação completa ou último ano', 'Go/Golang', 'Banco de dados relacional', 'Docker', 'Testes automatizados'],
    benefits: ['Salário R$ 6.000', 'Plano de saúde', 'Plano odontológico', 'Home office', 'Orçamento para cursos'],
    createdAt: '2024-01-20',
    active: true,
  },
  {
    id: '4',
    title: 'Estágio em Engenharia de Dados',
    company: 'Cresol Confederação',
    companyId: 'cresol',
    description: 'Estágio na área de Engenharia de Dados da Cresol Confederação. Atuação na construção e manutenção de pipelines de dados, modelagem de dados, integração de sistemas, qualidade de dados e apoio a iniciativas de analytics e BI. Trabalho com stack moderna de dados em ambiente financeiro cooperativo.',
    workload: '30h/semana',
    location: 'Bairro Industrial, Francisco Beltrão - PR (Presencial)',
    type: 'estagio',
    requirements: ['Cursando Ciência da Computação, Engenharia de Dados, Sistemas de Informação ou afins', 'Conhecimento em SQL e bancos de dados relacionais', 'Noções de Python (pandas, scripts de ETL)', 'Conceitos de modelagem dimensional e Data Warehouse', 'Interesse em cloud (AWS/Azure/GCP) e ferramentas de orquestração (Airflow/dbt)'],
    benefits: ['Bolsa auxílio compatível com o mercado', 'Vale transporte', 'Vale refeição', 'Horário flexível (compatível com aulas)', 'Mentoria técnica com time sênior de dados', 'Possibilidade de efetivação', 'Acesso a treinamentos e certificações'],
    createdAt: '2026-09-19',
    active: true,
  },
];

const initialEvents = [
  {
    id: '1',
    title: 'Meet in Bar - Ítalo Santos',
    organizer: 'SudoValley',
    organizerId: 'sudovalley',
    description: 'Encontro descontraído com Ítalo Santos para falar sobre empreendedorismo, ecossistema de inovação e oportunidades na região. Networking com cerveja artesanal.',
    date: '2026-09-24',
    time: '19:30',
    location: 'Schaf Bier',
    type: 'outro',
    capacity: 80,
    registeredCount: 32,
    image: '/images/Meet In Bar.jpg',
    createdAt: '2026-09-10',
    active: true,
  },
  {
    id: '2',
    title: 'Reunião Aberta - Núcleo SudoValley',
    organizer: 'Núcleo SudoValley',
    organizerId: 'sudovalley',
    description: 'Reunião aberta para apresentar o núcleo, projetos em andamento e como participar. Venha conhecer a comunidade de inovação e empreendedorismo da região sudoeste.',
    date: '2026-09-21',
    time: '18:00',
    location: 'ACEFB - Associação Comercial e Empresarial',
    type: 'palestra',
    capacity: 60,
    registeredCount: 18,
    image: '/images/Reunião sudovalley.jpg',
    createdAt: '2026-09-08',
    active: true,
  },
  {
    id: '3',
    title: 'TechWeek UTFPR 2026',
    organizer: 'UTFPR - Campus Francisco Beltrão',
    organizerId: 'utfpr',
    description: 'Semana de tecnologia com palestras, workshops, hackathon e feira de estágios. Temas: IA, DevOps, Cloud, Carreira Tech, Empreendedorismo. Aberta à comunidade.',
    date: '2026-10-19',
    time: '08:00',
    location: 'UTFPR Campus Francisco Beltrão',
    type: 'feira',
    capacity: 500,
    registeredCount: 245,
    image: '/images/TechWeekFB.jpg',
    createdAt: '2026-09-01',
    active: true,
  },
  {
    id: '4',
    title: 'The Coffee - Edição Online',
    organizer: 'SudoValley',
    organizerId: 'sudovalley',
    description: 'Encontro matinal para networking rápido e troca de experiências. Traga seu café e participe de conversas leves sobre tecnologia, carreira e projetos. 100% online via Zoom.',
    date: '2026-09-24',
    time: '08:30',
    location: 'Online (Zoom)',
    type: 'outro',
    capacity: 100,
    registeredCount: 27,
    image: '/images/The Coffee.jpg',
    createdAt: '2026-09-12',
    active: true,
  },
  {
    id: '5',
    title: '2º IdeiaThon - Hospital do Futuro',
    organizer: 'Hospital Regional + SudoValley',
    organizerId: 'hospital',
    description: 'Maratona de ideação para criar soluções inovadoras na saúde. 1º encontro presencial: formação de times, desafios, mentorias. Premiação para melhores ideias.',
    date: '2026-09-30',
    time: '14:00',
    location: 'Hospital Regional - Auditório',
    type: 'workshop',
    capacity: 80,
    registeredCount: 41,
    image: '/images/2ideiathon hospital do futuro.jpg',
    createdAt: '2026-09-05',
    active: true,
  },
  {
    id: '6',
    title: 'LatinoWare 2026',
    organizer: 'Comunidade LatinoWare',
    organizerId: 'latinoware',
    description: 'Maior evento de software livre e tecnologias abertas da América Latina. 3 dias de palestras, minicursos, hackathon, feira de projetos e muito networking. Temas: Linux, Python, IA, DevOps, IoT, Cultura Maker.',
    date: '2026-10-14',
    time: '08:00',
    location: 'Grand Carimã Resort - Foz do Iguaçu',
    type: 'feira',
    capacity: 1000,
    registeredCount: 678,
    image: '/images/LatinoWare.jpg',
    createdAt: '2026-08-15',
    active: true,
  },
  {
    id: '7',
    title: 'IdeaThon GovTech - Etapa UTFPR',
    organizer: 'Ecossistema de Inovação Francisco Beltrão',
    organizerId: 'ecossistema-fb',
    description: 'Maratona de ideação GovTech - Etapa 1 na UTFPR. Desenvolvimento de soluções tecnológicas para desafios do setor público. Mentorias, validação de ideias e pitch final. Premiação para as melhores soluções.',
    date: '2026-10-01',
    time: '08:30',
    location: 'UTFPR Campus Francisco Beltrão',
    type: 'workshop',
    capacity: 60,
    registeredCount: 22,
    image: '/images/Ideathon GovTech.jpg',
    createdAt: '2026-09-15',
    active: true,
  },
  {
    id: '8',
    title: 'IdeaThon GovTech - Etapa UNIOESTE',
    organizer: 'Ecossistema de Inovação Francisco Beltrão',
    organizerId: 'ecossistema-fb',
    description: 'Maratona de ideação GovTech - Etapa 2 na UNIOESTE. Continuação do desenvolvimento de soluções para o setor público. Workshops práticos, mentorias técnicas e validação de MVP.',
    date: '2026-10-07',
    time: '08:30',
    location: 'UNIOESTE Campus Francisco Beltrão',
    type: 'workshop',
    capacity: 60,
    registeredCount: 18,
    image: '/images/Ideathon GovTech.jpg',
    createdAt: '2026-09-15',
    active: true,
  },
  {
    id: '9',
    title: 'IdeaThon GovTech - Etapa UNIPAR',
    organizer: 'Ecossistema de Inovação Francisco Beltrão',
    organizerId: 'ecossistema-fb',
    description: 'Maratona de ideação GovTech - Etapa 3 na UNIPAR. Finalização dos projetos, preparação para demo day e apresentação para banca avaliadora. Premiação e oportunidades de incubação.',
    date: '2026-10-20',
    time: '08:30',
    location: 'UNIPAR Campus Francisco Beltrão',
    type: 'workshop',
    capacity: 60,
    registeredCount: 15,
    image: '/images/Ideathon GovTech.jpg',
    createdAt: '2026-09-15',
    active: true,
  },
  {
    id: '10',
    title: 'Palestra: Carreira em Tech - Do Estágio à Liderança',
    organizer: 'Prof. Dr. Carlos Silva',
    organizerId: 'prof1',
    description: 'Como construir uma carreira sólida em tecnologia. Trajetórias possíveis, habilidades essenciais, networking e mercado atual. Com sessão de perguntas ao final.',
    date: '2026-10-25',
    time: '19:00',
    location: 'Auditório Principal - Bloco A',
    type: 'palestra',
    capacity: 200,
    registeredCount: 45,
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
    createdAt: '2026-09-12',
    active: true,
  },
  {
    id: '11',
    title: 'Workshop Prático: React Avançado + TypeScript',
    organizer: 'TechSolutions Ltda',
    organizerId: 'comp1',
    description: 'Mão na massa: Hooks avançados, Context API, React Query, testes com Vitest/Testing Library, padrões de arquitetura. Tragam notebook.',
    date: '2026-11-05',
    time: '14:00',
    location: 'Lab de Informática 3 - Bloco B',
    type: 'workshop',
    capacity: 40,
    registeredCount: 28,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    createdAt: '2026-09-18',
    active: true,
  },
  {
    id: '12',
    title: 'Feira de Estágios e Oportunidades 2026',
    organizer: 'DAC - Diretório Acadêmico de Computação',
    organizerId: 'org1',
    description: 'Maior evento de recrutamento do semestre. 30+ empresas, palestras rápidas, networking, revisão de currículo, simulado de entrevista. Entrada gratuita.',
    date: '2026-11-15',
    time: '09:00',
    location: 'Ginásio Poliesportivo',
    type: 'feira',
    capacity: 500,
    registeredCount: 120,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    createdAt: '2026-09-05',
    active: true,
  },
];

export function DataProvider({ children }) {
  const [opportunities, setOpportunities] = useState(() => {
    const saved = localStorage.getItem('unihub_opportunities');
    return saved ? JSON.parse(saved) : initialOpportunities;
  });
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('unihub_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  useEffect(() => {
    localStorage.setItem('unihub_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('unihub_events', JSON.stringify(events));
  }, [events]);

  const addOpportunity = (opp) => {
    const newOpp = {
      ...opp,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().split('T')[0],
      active: true,
    };
    setOpportunities(prev => [newOpp, ...prev]);
  };

  const addEvent = (evt) => {
    const newEvt = {
      ...evt,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().split('T')[0],
      active: true,
      registeredCount: 0,
    };
    setEvents(prev => [newEvt, ...prev]);
  };

  const toggleOpportunity = (id) => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o));
  };

  const toggleEvent = (id) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, active: !e.active } : e));
  };

  const registerEvent = (id) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, registeredCount: e.registeredCount + 1 } : e));
  };

  return (
    <DataContext.Provider value={{ opportunities, events, addOpportunity, addEvent, toggleOpportunity, toggleEvent, registerEvent }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}