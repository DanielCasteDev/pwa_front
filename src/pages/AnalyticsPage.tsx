import { FiBarChart, FiTrendingUp, FiUsers, FiDollarSign } from 'react-icons/fi';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header de la página */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analíticas</h2>
        <p className="text-gray-600 mt-1">Estadísticas y métricas de rendimiento</p>
      </div>

      {/* Cards principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Visitas Totales</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2,345</p>
              <p className="text-green-600 text-sm mt-1 flex items-center">
                <FiTrendingUp className="w-3 h-3 mr-1" />
                +12% este mes
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiBarChart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Conversiones</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">89</p>
              <p className="text-green-600 text-sm mt-1 flex items-center">
                <FiTrendingUp className="w-3 h-3 mr-1" />
                +5% este mes
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FiUsers className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Ingresos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$12,345</p>
              <p className="text-green-600 text-sm mt-1 flex items-center">
                <FiTrendingUp className="w-3 h-3 mr-1" />
                +8% este mes
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tasa de Conversión</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">3.8%</p>
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <FiTrendingUp className="w-3 h-3 mr-1 rotate-180" />
                -2% este mes
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <FiBarChart className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos y métricas detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitas por Día</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Lunes</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">234</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Martes</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">267</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Miércoles</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">189</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Jueves</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '90%'}}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">312</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Viernes</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '95%'}}></div>
                </div>
                <span className="text-sm font-medium text-gray-900">345</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuentes de Tráfico</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Búsqueda Orgánica</span>
              <span className="font-bold text-gray-900">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Redes Sociales</span>
              <span className="font-bold text-gray-900">28%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tráfico Directo</span>
              <span className="font-bold text-gray-900">15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Referencias</span>
              <span className="font-bold text-gray-900">12%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}