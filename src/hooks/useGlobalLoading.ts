<<<<<<< HEAD
=======

>>>>>>> d8ca8b48532b3896a0d456fb80d7b6032addc6e7
import { create } from 'zustand';

interface GlobalLoadingState {
  isLoading: boolean;
  loadingMessage: string;
  setLoading: (loading: boolean, message?: string) => void;
}

export const useGlobalLoading = create<GlobalLoadingState>((set) => ({
  isLoading: false,
  loadingMessage: 'Loading...',
  setLoading: (loading, message = 'Loading...') => 
    set({ isLoading: loading, loadingMessage: message }),
}));
