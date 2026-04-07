import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LayoutState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  showEmployeeLegend: boolean;
  setShowEmployeeLegend: (show: boolean) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      showEmployeeLegend: true,
      setShowEmployeeLegend: (show) => set({ showEmployeeLegend: show }),
    }),
    {
      name: 'vnft-layout-storage', // name of the item in localStorage
    }
  )
);
