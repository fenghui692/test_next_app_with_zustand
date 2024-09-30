import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

const useCounterAndCourseStore = createWithEqualityFn(
  // 持久化
  persist(
    subscribeWithSelector(
      immer((set) => ({
        count: 0,
        learningData: {
          random: 0,
          age: 18,
          gender: "male",
        },
        increment: () =>
          set((state) => {
            state.count++; // immer 中间件允许的写法
          }),
        decrement: () => set((state) => ({ count: state.count - 1 })),
        modifyLearningData: () =>
          set((state) => {
            state.learningData.random = Math.random().toFixed(2); // immer 不允许这种写法之后再return， 二者选其一
            // return {
            //   learningData: {
            //     ...state.learningData,
            //     random: Math.random().toFixed(2),
            //   },
            // };
          }, false), // set的二个参数为true，相当与把这个store的所有值都去了，只剩下本次，但是immer写法不生效 ;  true置空后所有值包括此函数(modifyLearningData)都无效了，因为被覆盖了
        courseName: "next.js",
        coursesList: [1, 2, 3],
        addCourse: (course) =>
          set((state) => ({ coursesList: [...state.coursesList, course] })),
        // set((state) => {
        //   state.coursesList.push(course);}),
      }))
    ),
    {
      name: "countAndCourse",
      storage: createJSONStorage(() => localStorage), // 默认为localStorage ，这一行可以不写
    }
  ),
  shallow
);

export default useCounterAndCourseStore;
