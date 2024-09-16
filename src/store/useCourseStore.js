import { create } from "zustand";

const useCourseStore = create((set) => ({
  courseName: "next.js",
  coursesList: [1, 2, 3],
  addCourse: (course) =>
    set((state) => ({ coursesList: [...state.coursesList, course] })),
}));

export default useCourseStore;
