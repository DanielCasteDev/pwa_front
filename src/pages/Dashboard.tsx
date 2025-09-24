import { FiUsers, FiDollarSign, FiPackage, FiShoppingCart } from 'react-icons/fi';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header de bienvenida */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">¡Bienvenido al Dashboard!</h2>
            <p className="text-gray-600 mt-1">Aquí tienes un resumen de tu aplicación</p>
          </div>
          <div className="hidden md:block">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,234</p>
              <p className="text-green-600 text-sm mt-1">+12% este mes</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Ventas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$12,345</p>
              <p className="text-green-600 text-sm mt-1">+8% este mes</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pedidos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">89</p>
              <p className="text-blue-600 text-sm mt-1">+5% este mes</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <FiShoppingCart className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Productos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">456</p>
              <p className="text-purple-600 text-sm mt-1">+3% este mes</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FiPackage className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Sección adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FiUsers className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Nuevo usuario registrado</p>
                <p className="text-sm text-gray-500">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FiShoppingCart className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Pedido completado</p>
                <p className="text-sm text-gray-500">Hace 4 horas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <FiPackage className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Producto actualizado</p>
                <p className="text-sm text-gray-500">Hace 6 horas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Día</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Visitas</span>
              <span className="font-bold text-gray-900">2,345</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conversiones</span>
              <span className="font-bold text-gray-900">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ingresos</span>
              <span className="font-bold text-gray-900">$1,234</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}