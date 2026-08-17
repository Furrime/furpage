import { create } from 'zustand';

interface AdminStore {
  isLoggedIn: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  isLoggedIn: false,
  login: async (password: string) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (data.success) {
        set({ isLoggedIn: true });
        localStorage.setItem('admin_logged_in', 'true');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
  logout: () => {
    set({ isLoggedIn: false });
    localStorage.removeItem('admin_logged_in');
  },
}));
