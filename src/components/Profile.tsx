import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';

import styles from '../styles/components/Profile.module.css';

export function Profile(){

	const { level } = useContext(ChallengesContext);

	return(
		<div className={styles.profileContainer}>
			<div>
				<img src="https://github.com/LuisEvandro.png" alt="Luis Evandro" className={styles.profileAvatar} />
			</div>
			<div>
				<strong>Luis Evandro</strong>
				<p>
					<img src="icons/level.svg" alt="Level" />
					Level {level}
				</p>
			</div>
		</div>
	);
}