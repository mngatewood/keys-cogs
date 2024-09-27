import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { EditKey } from './EditKey';

interface CogKeysProps {
	updateKeys: Function
	resetCards: Function
	saveGame: Function
	keys: Array<string>
	playerReady: Function
	round: number
}

export const CogKeys: React.FC<CogKeysProps> = ({updateKeys, resetCards, saveGame, keys, playerReady, round}) => {
	const [isEditing, setIsEditing] = useState(0);

	const handleClickEdit = (keyId: number) => {
		document.getElementById(`key-${keyId}`)?.classList.add("highlighted-key");
		document.getElementById(`key-${keyId}`)?.classList.remove("highlighted-error");
		setIsEditing(keyId);
	}

	const handleFormUpdate = (operation: string, keyId: number, value: string) => {
		if (operation === "save") {
			const updatedKeys = keys.map((key, index) => index === (keyId - 1) ? value :key);
			updateKeys(updatedKeys);
		}
		document.getElementById(`key-${keyId}`)?.classList.remove("highlighted-key");
		setIsEditing(0);
	}

	const handleResetCards = () => {
		resetCards();
	}

	const handleSaveGame = () => {

		saveGame().then((result: boolean) => {
			if (!result) {

				const cogCards = document.querySelectorAll(".droppable");
				cogCards?.forEach((card) => {
					if (["1", "2", "3", "4"].includes(card.id)) {
						card.classList.add("highlighted-error");
					} else {
						card.classList.remove("highlighted-error");
					}
				})

				const keyInputs = document.querySelectorAll(".key-placeholder");
				keyInputs?.forEach((input) => {
					if ((input as HTMLElement).innerText === "click to add a key") {
						input.classList.add("highlighted-error");			
					} else {
						input.classList.remove("highlighted-error");
					}
				});
			}
		}).catch((error: Meteor.Error) => {			
			console.log("failed to save", error)
		})
	}

	const keyDisplayContent = (key: string) => {
		if (key === "") {
			return {content: "click to add a key", class: "animate-key key-placeholder"}
		} else {
			return {content: key, class: "animate-key"}
		}
	}

	return (
		<>
			{isEditing !== 0 && 
				<>
					<div className="h-screen w-screen fixed top-0 left-0 z-50 bg-purple-500 bg-opacity-50" />
					<EditKey updateForm={handleFormUpdate} keyId={isEditing} keyValue={keys[isEditing - 1]} />
				</>
			}
			<div className={round ? "key cog-top key-locked" : "key cog-top" }
				onClick={round ? () => {} : () => handleClickEdit(1)}>
				<TransitionGroup>
					<CSSTransition
						key={keys[0]}
						timeout={1000}
						classNames="slideY"
					>
						<div id="key-1" className={keyDisplayContent(keys[0]).class} >{keyDisplayContent(keys[0]).content}</div>
					</CSSTransition>
				</TransitionGroup>
			</div>
			<div className={round ? "key cog-right key-locked" : "key cog-right"} 
				onClick={round ? () => {} : () => handleClickEdit(2)}>
				<TransitionGroup>
					<CSSTransition
						key={keys[1]}
						timeout={1000}
						classNames="slideX"
					>
						<div id="key-2" className={keyDisplayContent(keys[1]).class} >{keyDisplayContent(keys[1]).content}</div>
					</CSSTransition>
				</TransitionGroup>
			</div>
			<div className={round ? "key cog-bottom key-locked" : "key cog-bottom"}
				onClick={round ? () => {} : () => handleClickEdit(3)}>
				<TransitionGroup>
					<CSSTransition
						key={keys[2]}
						timeout={1000}
						classNames="slideY"
					>
						<div id="key-3" className={keyDisplayContent(keys[2]).class} >{keyDisplayContent(keys[2]).content}</div>
					</CSSTransition>
				</TransitionGroup>
			</div>
			<div className={round ? "key cog-left key-locked" : "key cog-left"}
				onClick={round ? () => {} : () => handleClickEdit(4)}>
				<TransitionGroup>
					<CSSTransition
						key={keys[3]}
						timeout={1000}
						classNames="slideX"
					>
						<div id="key-4" className={keyDisplayContent(keys[3]).class} >{keyDisplayContent(keys[3]).content}</div>
					</CSSTransition>
				</TransitionGroup>
			</div>
			<div className="cog-panel">
				<button className='cog-button' onClick={handleResetCards}>
					<img className='cog-img' src='/reset-icon.png' />
				</button>
			</div>
			{ !playerReady() &&
				<div className="cog-save">
					<button onClick={handleSaveGame}>
						<img className='save-img' src='/save-icon.png' />
					</button>
				</div>
			}
		</>
	)
}