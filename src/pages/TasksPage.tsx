import { FiPlus } from 'react-icons/fi';

export default function TasksPage() {
  return (
    <div className="space-y-6">
      {/* Header de la página */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tareas</h2>
          <p className="text-gray-600 mt-1">Gestión de tareas y proyectos</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <FiPlus className="w-4 h-4" />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {/* Lista de tareas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Tareas</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
              <div className="flex-1">
                <span className="text-gray-900 font-medium">Completar proyecto PWA</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-red-500 bg-red-100">
                    Alta
                  </span>
                  <span className="text-sm text-gray-500">Vence: 15 Dic 2024</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-green-50">
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" checked />
              <div className="flex-1">
                <span className="text-gray-900 font-medium line-through">Aprender Tailwind CSS</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-yellow-500 bg-yellow-100">
                    Media
                  </span>
                  <span className="text-sm text-gray-500">Completada: 10 Dic 2024</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
              <div className="flex-1">
                <span className="text-gray-900 font-medium">Configurar service worker</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-green-500 bg-green-100">
                    Baja
                  </span>
                  <span className="text-sm text-gray-500">Vence: 20 Dic 2024</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
              <div className="flex-1">
                <span className="text-gray-900 font-medium">Implementar autenticación</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-red-500 bg-red-100">
                    Alta
                  </span>
                  <span className="text-sm text-gray-500">Vence: 18 Dic 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}