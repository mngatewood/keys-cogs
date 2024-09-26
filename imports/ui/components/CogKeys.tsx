import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { EditKey } from './EditKey';

interface CogKeysProps {
	updateKeys: Function
	resetCards: Function
	saveGame: Function
	keys: Array<string>
}

export const CogKeys: React.FC<CogKeysProps> = ({updateKeys, resetCards, saveGame,keys}) => {
	const [isEditing, setIsEditing] = useState(0);

	const handleClickEdit = (keyId: number) => {
		document.getElementById(`key-${keyId}`)?.classList.add("highlighted-key");
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
			if (result) {
				console.log("saved successfully", result)
			} else {
				console.log("failed to save due to validation error", result)
				// TODO highlight missing keys and cards
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
			{isEditing !== 0 && <EditKey updateForm={handleFormUpdate} keyId={isEditing} keyValue={keys[isEditing - 1]} />}
			<div className="key cog-top" onClick={() => handleClickEdit(1)}>
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
			<div className="key cog-right" onClick={() => handleClickEdit(2)}>
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
			<div className="key cog-bottom" onClick={() => handleClickEdit(3)}>
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
			<div className="key cog-left" onClick={() => handleClickEdit(4)}>
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
			<div className="cog-save">
				<button onClick={handleSaveGame}>
					<img className='save-img' src='/save-icon.png' />
				</button>
			</div>
		</>
	)
}