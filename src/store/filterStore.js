import { Store } from '@tanstack/react-store';

// Define initial state
const initialState = {
  filterId: '',
  isLoading: false,
};

// Create the store
export const filterStore = new Store(initialState);

// Define actions separately
export const setFilterId = (id) => {
  filterStore.setState((state) => ({
    ...state,
    filterId: id,
  }));
};

export const setIsLoading = (isLoading) => {
  filterStore.setState((state) => ({
    ...state,
    isLoading,
  }));
};

export const resetFilterId = () => {
  filterStore.setState((state) => ({
    ...state,
    filterId: '',
  }));
};
