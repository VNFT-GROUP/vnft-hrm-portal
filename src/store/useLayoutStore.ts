import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LayoutState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  showEmployeeLegend: boolean;
  setShowEmployeeLegend: (show: boolean) => void;
  showDepartmentLegend: boolean;
  setShowDepartmentLegend: (show: boolean) => void;
  showRoleLegend: boolean;
  setShowRoleLegend: (show: boolean) => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      showEmployeeLegend: true,
      setShowEmployeeLegend: (show) => set({ showEmployeeLegend: show }),
      showDepartmentLegend: true,
      setShowDepartmentLegend: (show) => set({ showDepartmentLegend: show }),
      showRoleLegend: true,
      setShowRoleLegend: (show) => set({ showRoleLegend: show }),
    }),
    {
      name: 'vnft-layout-storage', // name of the item in localStorage
    }
  )
);
