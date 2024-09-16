import { create } from "zustand";

// 基础用法
const useCounterStore = create((set, get) => ({
  count: 0,
  learningData: {
    random: 0,
    age: 18,
    gender: "male",
  },
  // 两种获取值store值的方法, get() 或者 set中的参数state
  increment: () => set(() => ({ count: get().count + 1 })), // get()
  decrement: () => set((state) => ({ count: state.count - 1 })), // state中
  modifyLearningData: () =>
    set((state) => {
      return {
        learningData: {
          ...state.learningData, // 需要使用...保留原理的值，否则会覆盖掉原来的值
          random: Math.random().toFixed(2),
        },
      };
    }),
}));

export default useCounterStore;
