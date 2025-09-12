import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

// Mock data otimizado - dados estáticos para melhor performance
const MOCK_EVENTS = [
  { id: 1, title: 'Limpeza Geral', date: '2025-01-10', time: '09:00', category: 'faxina', priority: 'alta', completed: false },
  { id: 2, title: 'Compras Semanais', date: '2025-01-11', time: '15:00', category: 'mercado', priority: 'media', completed: false },
  { id: 3, title: 'Receita: Lasanha', date: '2025-01-12', time: '18:00', category: 'cozinha', priority: 'baixa', completed: true },
  { id: 4, title: 'Organizar Closet', date: '2025-01-13', time: '10:00', category: 'faxina', priority: 'media', completed: false },
  { id: 5, title: 'Lista Feira', date: '2025-01-14', time: '08:00', category: 'mercado', priority: 'alta', completed: false }
];

const CATEGORIES = {
  faxina: { label: 'Faxina', color: 'bg-green-500', icon: 'fa-solid fa-broom' },
  mercado: { label: 'Mercado', color: 'bg-blue-500', icon: 'fa-solid fa-shopping-cart' },
  cozinha: { label: 'Cozinha', color: 'bg-orange-500', icon: 'fa-solid fa-utensils' }
};

const PRIORITIES = {
  alta: 'border-l-4 border-red-500',
  media: 'border-l-4 border-yellow-500', 
  baixa: 'border-l-4 border-green-500'
};

// Helper functions para evitar nested ternary
const getPriorityStyles = (priority) => {
  switch (priority) {
    case 'alta':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'media':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    default:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  }
};

const getEmptyMessage = (filter) => {
  if (filter === 'all') {
    return 'Não há tarefas agendadas para este dia.';
  }
  if (filter === 'completed') {
    return 'Não há tarefas concluídas para este dia.';
  }
  if (filter === 'pending') {
    return 'Não há tarefas pendentes para este dia.';
  }
  return `Não há tarefas da categoria ${filter} para este dia.`;
};

// Componente otimizado para item individual
const EventItem = React.memo(({ event, onToggle, onEdit }) => {
  const category = CATEGORIES[event.category];
  const priorityClass = PRIORITIES[event.priority];

  return (
    <div className={`card-glass rounded-lg p-4 ${priorityClass} hover:shadow-lg transition-shadow duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-3 h-3 rounded-full ${category.color} flex-shrink-0`}></span>
            <h3 className={`font-semibold text-sm ${event.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
              {event.title}
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <i className="fa-solid fa-clock" />{' '}
              {event.time}
            </span>
            <span className="flex items-center gap-1">
              <i className={category.icon} />{' '}
              {category.label}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityStyles(event.priority)}`}>
              {event.priority}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onToggle(event.id)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              event.completed 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
            aria-label={event.completed ? 'Marcar como pendente' : 'Marcar como concluído'}
          >
            <i className={`fa-solid ${event.completed ? 'fa-check' : 'fa-circle'} text-sm`}></i>
          </button>
        </div>
      </div>
    </div>
  );
});

EventItem.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

EventItem.displayName = 'EventItem';

export default function Agenda() {
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filter, setFilter] = useState('all');

  // Memoized calculations para performance
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesDate = event.date === selectedDate;
      const matchesFilter = filter === 'all' || 
                           (filter === 'completed' && event.completed) ||
                           (filter === 'pending' && !event.completed) ||
                           event.category === filter;
      return matchesDate && matchesFilter;
    });
  }, [events, selectedDate, filter]);

  const stats = useMemo(() => {
    const dayEvents = events.filter(event => event.date === selectedDate);
    return {
      total: dayEvents.length,
      completed: dayEvents.filter(e => e.completed).length,
      pending: dayEvents.filter(e => !e.completed).length
    };
  }, [events, selectedDate]);

  // Callbacks otimizados
  const handleToggleEvent = useCallback((eventId) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, completed: !event.completed } : event
    ));
  }, []);

  const handleDateChange = useCallback((e) => {
    setSelectedDate(e.target.value);
  }, []);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);

  // Quick date navigation
  const navigateDate = useCallback((direction) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + direction);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  }, [selectedDate]);

  return (
    <div className="h-full p-4 lg:p-6 overflow-y-auto custom-scrollbar">
      {/* Header Otimizado com ícone */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 mb-2 sm:mb-0">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
            <i className="fa-solid fa-calendar-days text-lg sm:text-xl text-blue-600 dark:text-blue-400" aria-label="agenda"></i>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Agenda Semanal
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Organize suas tarefas por dia da semana
            </p>
          </div>
        </div>

        {/* Date Navigation - Mobile Optimized */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateDate(-1)}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            aria-label="Dia anterior"
          >
            <i className="fa-solid fa-chevron-left text-sm"></i>
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            onClick={() => navigateDate(1)}
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            aria-label="Próximo dia"
          >
            <i className="fa-solid fa-chevron-right text-sm"></i>
          </button>
        </div>
      </div>

      {/* Stats Cards - Simplified */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card-glass rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </div>
        <div className="card-glass rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
            {stats.completed}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Concluídas</div>
        </div>
        <div className="card-glass rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
            {stats.pending}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Pendentes</div>
        </div>
      </div>

      {/* Filters - Optimized */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'Todas', icon: 'fa-solid fa-list' },
          { key: 'pending', label: 'Pendentes', icon: 'fa-solid fa-clock' },
          { key: 'completed', label: 'Concluídas', icon: 'fa-solid fa-check' },
          { key: 'faxina', label: 'Faxina', icon: 'fa-solid fa-broom' },
          { key: 'mercado', label: 'Mercado', icon: 'fa-solid fa-shopping-cart' },
          { key: 'cozinha', label: 'Cozinha', icon: 'fa-solid fa-utensils' }
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => handleFilterChange(filterOption.key)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
              filter === filterOption.key
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <i className={filterOption.icon}></i>
            {filterOption.label}
          </button>
        ))}
      </div>

      {/* Events List - Virtualized for performance */}
      <div className="space-y-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              onToggle={handleToggleEvent}
              onEdit={() => {}} // Placeholder para futura funcionalidade
            />
          ))
        ) : (
          <div className="card-glass rounded-lg p-8 text-center">
            <i className="fa-solid fa-calendar-xmark text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhuma tarefa encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {getEmptyMessage(filter)}
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full sm:w-auto px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
          <i className="fa-solid fa-plus"></i>
          Nova Tarefa
        </button>
      </div>
    </div>
  );
}