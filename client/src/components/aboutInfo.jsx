import React from 'react';
import styles from '../../styles/aboutInfo.css';

const AboutInfo = (props) => {
  return (
    <div className={styles.about}>
      <div className={styles.topic}>
        <a> Let's talk <i> gender and politics...</i></a>
      </div>
      <div className={styles.description}>
        <ul>
          <li>Input a Twitter username</li>
          <li>Our algorithm will analyse their friends and tweets</li>
          <li>We'll let you know if they're Republican or Democratic, and try to predict their gender</li>
        </ul>
      </div>

    </div>
  );
};

export default AboutInfo;
