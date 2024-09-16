"use client";
import useCounterAndCourseStore from "@/store/useCounterAndCourseStore";
import { Button } from "antd";
import { memo, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { shallow } from "zustand/shallow";

import styles from "@/app/page.module.css";

export default function Home() {
  const count = useCounterAndCourseStore((state) => state.count);
  const increment = useCounterAndCourseStore((state) => state.increment);
  const decrement = useCounterAndCourseStore((state) => state.decrement);

  // 无优化
  // const { learningData, modifyLearningData } = useCounterAndCourseStore();

  // 本身就是优化
  // const learningData = useCounterAndCourseStore((state) => state.learningData);
  // const modifyLearningData = useCounterAndCourseStore(
  //   (state) => state.modifyLearningData
  // );

  // useShallow 优化
  // const { learningData, modifyLearningData } = useCounterAndCourseStore(
  //   useShallow((state) => ({
  //     learningData: state.learningData,
  //     modifyLearningData: state.modifyLearningData,
  //   }))
  // );

  // shallow 优化
  const { learningData, modifyLearningData } = useCounterAndCourseStore(
    (state) => ({
      learningData: state.learningData,
      modifyLearningData: state.modifyLearningData,
    }),
    shallow
  );

  console.log("parent");

  useEffect(() => {
    // 订阅 count 值的变化
    // useCounterAndCourseStore.subscribe((state, oldState) => {
    //   console.log("Count has changed:", state, oldState);
    // });
    // useCounterAndCourseStore.subscribe(
    //   // 这种是使用store 中使用了subscribeWithSelector 中间件才能这么用，可以监听部分值，而上面的都会监听到
    //   (state) => state.count, // 监听单个值变化才会触发
    //   (state, oldState) => {
    //     console.log("Count has changed:", state, oldState);
    //   }
    // );
    // useCounterAndCourseStore.subscribe(
    //   // 这种是使用store 中使用了subscribeWithSelector 中间件才能这么用，可以监听部分值，而上面的都会监听到
    //   (state) => [state.count, state.learningData], // 因为返回的数组，引用对象， 所以每个值都会引起变化，第三个参数中可以使用shadow用来浅比较内部值
    //   // (state) => ({xx: state.count}),
    //   (state, oldState) => {
    //     console.log("Count has changed:", state, oldState);
    //   },
    //   {
    //     equalityFn: shallow,
    //     // fireImmediately: true  // 初始化立即就执行一次
    //   }
    // );
  }, []);

  return (
    <div className={styles.container}>
      <div>{count}</div>
      <div>{JSON.stringify(learningData)}</div>
      <Button type="primary" onClick={increment}>
        +
      </Button>
      <Button type="primary" onClick={decrement}>
        -
      </Button>
      <Button type="primary" onClick={modifyLearningData}>
        修改learningData
      </Button>
      <br />
      <ChildrenPage />
    </div>
  );
}

const ChildrenPage = memo(() => {
  const courseName = useCounterAndCourseStore((state) => state.courseName);
  const coursesList = useCounterAndCourseStore((state) => state.coursesList);
  const addCourse = useCounterAndCourseStore((state) => state.addCourse);

  // const { addCourse, courseName, coursesList } = useCounterAndCourseStore();
  console.log("children");

  return (
    <>
      <div>{courseName}</div>
      <div>{coursesList.map((item) => item + " ")}</div>
      <Button type="primary" onClick={() => addCourse(coursesList.length + 1)}>
        添加course
      </Button>
    </>
  );
});

// 父组件值发生变化，子组件也会重新渲染 ，子组件memo可以解决
/* const { learningData, modifyLearningData } = useCounterAndCourseStore(); // 这种写法不好
   子组件只有他的值,但是useCounterAndCourseStore() 相当于全部用了， 所以子组件也会重新渲染 */

// 如果共用一个store，那么一个组件引起另一个组件变化(例如子影响父) ，需要使用useShallow、shallow
// 父影响子就用memo
