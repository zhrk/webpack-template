import React, { useState } from 'react';
import styles from './styles.css';

const Root = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen(!isOpen);

  return (
    <div className={styles.container}>
      <button type="button" onClick={handleClick}>{isOpen ? 'Close' : 'Open'}</button>
      <h1>
        We are
        {isOpen ? ' open' : ' closed'}
      </h1>
    </div>
  );
};

export default Root;
