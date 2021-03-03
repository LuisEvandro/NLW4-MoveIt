import { createContext, ReactNode, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';

interface Challenge{
	type: 'body' | 'eye';
	description: string;
	amount: number;
}

interface ChallengesContextData {
	level: number;
	currentExperience: number;
	challengesCompleted: number;
	activeChallenge: Challenge;
	experienceToNextLevel: number;
	levelUp: () => void;
	startNewChallenge: () => void;
	resetChallenge: () => void;
	completedChallenge: () => void;
	closeModalLevelUp: () => void;
}

interface ChallengesProviderProps {
	children: ReactNode;
	level: number;
	currentExperience: number;
	challengesCompleted: number;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps){

	const [ level, setLevel ] = useState(rest.level ?? 1);
	const [ currentExperience ,  setCurrentExperience ] = useState(rest.currentExperience ?? 0);
	const [ challengesCompleted ,  setchallengesCompleted ] = useState(rest.challengesCompleted ?? 0);

	const [ activeChallenge, setActiveChallenge ] = useState(null);
	const [ isLevelModalOpen, setIsLevelModalOpen] = useState(false);

	const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

	useEffect(() => {
		Notification.requestPermission();	
	}, [])

	useEffect(() => {
		
		Cookies.set('level', level.toString());
		Cookies.set('currentExperience', currentExperience.toString());
		Cookies.set('challengesCompleted', challengesCompleted.toString());

	}, [level, currentExperience, challengesCompleted])

	function levelUp(){
		setLevel(level + 1);
		setIsLevelModalOpen(true);
	}

	function closeModalLevelUp(){
		setIsLevelModalOpen(false);
	}

	function startNewChallenge(){
		const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
		const challenge = challenges[randomChallengeIndex];

		setActiveChallenge(challenge);

		new Audio('/notification.mp3').play();

		if(Notification.permission === "granted"){
			new Notification('Novo desafio liberado =)',{
				body: `Desafio valendo ${challenge.amount} xp!!`
			});
		}			
	}

	function resetChallenge(){
		setActiveChallenge(null);
	}

	function completedChallenge(){
		if (!activeChallenge)
			return;

		const { amount } = activeChallenge;

		let finalExperince = currentExperience + amount;

		if (finalExperince >= experienceToNextLevel){
			finalExperince = finalExperince - experienceToNextLevel;
			levelUp();
		}

		setCurrentExperience(finalExperince);
		setActiveChallenge(null);
		setchallengesCompleted(challengesCompleted + 1);
	}

	return(
		<ChallengesContext.Provider 
			value={{ 
				level,
				currentExperience,
				challengesCompleted,
				activeChallenge,
				experienceToNextLevel,
				levelUp,
				startNewChallenge,
				resetChallenge,
				completedChallenge,
				closeModalLevelUp
			}}
		>
			{children}

			{isLevelModalOpen && <LevelUpModal/>}

		</ChallengesContext.Provider>
	);
}