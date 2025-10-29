import { AuthProvider } from './context/AuthContext';
import StorePage from './pages/StorePage';

export default function App() {
  return (
    <AuthProvider>
      <StorePage />
    </AuthProvider>
  );
}