"use client";
import useCounterStore from "@/store/useCounterStore";
import useCourseStore from "@/store/useCourseStore";
import { memo, useEffect, useState } from "react";
import { Button } from "antd";
import styles from "./page.module.css";

const outerFn = () => {
  // 可以在外部，不需要使用react组件包裹
  // 同样也有第二个参数，用来控制是否覆盖原有的所有值
  useCounterStore.setState({ count: 1000 }, false);
  // useCounterStore.setState((state) => {
  //   return { count: state.count + 1 };
  // }, false);
};

export default function Home() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const { learningData, modifyLearningData } = useCounterStore(); // 这种写法不好，因为store中一个变化都会刷新

  // const coursesList = useCourseStore((state) => state.coursesList); // 没有用到，但是子组件中状态变化了，这里即使定义也会造成渲染

  // useEffect(() => {
  //   setTimeout(() => {
  //     outerFn();
  //   }, 3000);
  // }, []);

  console.log("parent");

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
  const courseName = useCourseStore((state) => state.courseName);
  const coursesList = useCourseStore((state) => state.coursesList);
  const addCourse = useCourseStore((state) => state.addCourse);

  // 下面用了父的store，父修改了，如果定义了即使没有用到也会渲染

  // const { learningData, modifyLearningData } = useCounterStore();  // 这样默认是全部监听，store变化而都会渲染
  // const modifyLearningData= useCounterStore(state =>state.learningData);  // 这样只监听learningData变化，count变化不会渲染

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

// 父组件值发生变化，子组件也会重新渲染 ，子组件memo可以解决(并且没有用到父的更改的state)
// 这个例子中，子组件变化，父组件不会渲染，因为不使用一个store， 如果父中使用了子修改的后的值(例如courseList), 父组件也会重新渲染
