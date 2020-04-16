import React from 'react';
import styles from './styles.css';

const Root = () => {
  const test = 1;

  const a = 2;

  const jopa = (asd) => {
    return a + asd;
  };

  return <div className={styles.container}>root</div>;
};

export default Root;
