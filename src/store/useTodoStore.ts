import { create } from 'zustand';

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

type Store = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
};

export const useTodoStore = create<Store>((set) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
}));


