import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      graph: { concepts: [] },
      activeSession: null,
      
      setUser: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null, graph: { concepts: [] } }),
      
      setGraph: (graph) => set({ graph }),
      
      startSession: (topic) => set({ 
        activeSession: { 
          topic, 
          startTime: Date.now(),
          responses: []
        } 
      }),
      
      endSession: () => set({ activeSession: null }),
      
      updateConceptInGraph: (updatedConcept) => {
        const { graph } = get();
        const concepts = [...graph.concepts];
        const index = concepts.findIndex(c => c.title === updatedConcept.title);
        
        if (index > -1) {
          concepts[index] = updatedConcept;
        } else {
          concepts.push(updatedConcept);
        }
        
        set({ graph: { ...graph, concepts } });
      }
    }),
    {
      name: 'learning-twin-storage',
    }
  )
);
