import { create } from 'zustand'

export interface Tab {
  id: string
  title: string
  path: string
  closable?: boolean
}

interface TabState {
  tabs: Tab[]
  activeTabId: string
  addTab: (tab: Tab) => void
  removeTab: (id: string) => void
  setActiveTab: (id: string) => void
}

export const useTabStore = create<TabState>((set) => ({
  tabs: [
    { id: 'dashboard', title: 'Dashboard', path: '/dashboard', closable: false }
  ],
  activeTabId: 'dashboard',
  addTab: (tab) => set((state) => {
    if (state.tabs.find(t => t.id === tab.id)) {
      return { activeTabId: tab.id }
    }
    return { 
      tabs: [...state.tabs, tab],
      activeTabId: tab.id
    }

  }),
  removeTab: (id) => set((state) => {
    const tabIndex = state.tabs.findIndex(t => t.id === id)
    const newTabs = state.tabs.filter(t => t.id !== id)
    let newActiveId = state.activeTabId
    
    if (state.activeTabId === id) {
      newActiveId = newTabs[Math.max(0, tabIndex - 1)].id
    }
    
    return { tabs: newTabs, activeTabId: newActiveId }
  }),
  setActiveTab: (id) => set({ activeTabId: id }),
}))

