"use client";
import useCounterAndCourseStore from "@/store/useCounterAndCourseStore";
import { Button } from "antd";
import { memo, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { shallow } from "zustand/shallow";

import styles from "@/app/page.module.css";

/**
 * 只讨论最新的zustand v5版本
 * There is a behavioral change in v5 to match React default behavior. If a selector returns a new reference, it may cause infinite loops.
 * v5 中的行为变化与 React 默认行为一致。如果选择器返回一个新引用，可能会导致无限循环. 解决方法：
 * 1. 组件中state.xxx 具体取值
 * 2. 组件中使用useShallow
 * 3. store中使用createWithEqualityFn + shallow
 * 4. store中使用createWithEqualityFn，这样可以变成v4的行为，然后组件中可以使用shallow(或者自定义)
 */
export default function Home() {
  const count = useCounterAndCourseStore((state) => state.count);
  const increment = useCounterAndCourseStore((state) => state.increment);
  const decrement = useCounterAndCourseStore((state) => state.decrement);


  // 下面演示子组件ChildrenPage中的state变化后导致父组件重新渲染，处理如下:

  // 无优化
  // const { learningData, modifyLearningData } = useCounterAndCourseStore();

  // 1.本身就是优化
  // const learningData = useCounterAndCourseStore((state) => state.learningData);
  // const modifyLearningData = useCounterAndCourseStore(
  //   (state) => state.modifyLearningData
  // );

  // 2.useShallow 优化
  // const { learningData, modifyLearningData } = useCounterAndCourseStore(
  //   useShallow((state) => ({
  //     learningData: state.learningData,
  //     modifyLearningData: state.modifyLearningData,
  //   }))
  // );

  // 3.createWithEqualityFn + shallow
  const { learningData, modifyLearningData } = useCounterAndCourseStore(
    (state) => ({
      learningData: state.learningData,
      modifyLearningData: state.modifyLearningData,
    }),
  );

  // 4.1 createWithEqualityFn代替create是（变成v4解决 infinite loops问题(无优化)）， 优化需要加上第二个参数shallow
  // const { learningData, modifyLearningData } = useCounterAndCourseStore(
  //   (state) => ({
  //     learningData: state.learningData,
  //     modifyLearningData: state.modifyLearningData,
  //   }),
  //   shallow
  // );

  //  4.2 createWithEqualityFn代替create是（变成v4解决 infinite loops问题(无优化)）， 优化需要加上第二个参数，自己实现的版本
  // const { learningData, modifyLearningData } = useCounterAndCourseStore(
  //   (state) => ({
  //     learningData: state.learningData,
  //     modifyLearningData: state.modifyLearningData,
  //   }),
  //   (obj1, obj2) => {
  //     if (obj1 === obj2) return true; // 如果引用相同，直接返回 true， true是不渲染
  //     if (obj1 == null || obj2 == null) return false; // 如果其中一个是 null 或 undefined
  //     const keys1 = Object.keys(obj1);
  //     const keys2 = Object.keys(obj2);
  //     if (keys1.length !== keys2.length) return false; // 如果键的数量不同，返回 false
  //     for (let key of keys1) {
  //       if (obj1[key] !== obj2[key]) return false; // 如果属性值不同，返回 false
  //     }
  //     return true; // 如果所有属性值都相同，返回 true
  //   }
  // );

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

// 如果共用一个store，那么一个组件引起另一个组件变化(例如子影响父) ，尝试使用1,2,3,4 来优化
// 父影响子就用memo
