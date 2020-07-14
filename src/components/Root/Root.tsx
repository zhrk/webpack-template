import React, { useState } from 'react';
import styles from './styles.scss';

const Root: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (value: boolean) => setIsOpen(value);

  return (
    <div className={styles.container}>
      <button type="button" onClick={() => handleClick(!isOpen)}>
        {isOpen ? 'Close' : 'Open'}
      </button>
      <h1>
        We are
        {isOpen ? ' open' : ' closed'}
      </h1>
    </div>
  );
};

export default Root;
