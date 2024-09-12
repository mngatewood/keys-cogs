import React, { useState } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";

interface CogKeysProps {
	updateKeys: Function
	keys: Array<string>
}

export const CogKeys: React.FC<CogKeysProps> = ({updateKeys, keys}) => {

	const handleKeyUpdate = () => {
		updateKeys(keys);
	}

	return (
		<>
			<div className="key cog-top">
				<TransitionGroup>
					<CSSTransition
						key={keys[0]}
						timeout={1000}
						classNames="slideX"
					>
						<div className="animate-key">{keys[0]}</div>
					</CSSTransition>
				</TransitionGroup>
			</div>
			<div className="key cog-right">
				<TransitionGroup>
					<CSSTransition
						key={keys[1]}
						timeout={1000}
						classNames="slideY"
					>
						<div className="animate-key">{keys[1]}</div>
					</CSSTransition>
				</TransitionGroup>
			</div>
			<div className="key cog-bottom">
				<TransitionGroup>
					<CSSTransition
						key={keys[2]}
						timeout={1000}
						classNames="slideX"
					>
						<div className="animate-key">{keys[2]}}</div>
					</CSSTransition>
				</TransitionGroup>
			</div>
			<div className="key cog-left">
				<TransitionGroup>
					<CSSTransition
						key={keys[3]}
						timeout={1000}
						classNames="slideY"
					>
						<div className="animate-key">{keys[3]}}</div>
					</CSSTransition>
				</TransitionGroup>
			</div>
			<div className="cog-panel">
				<button className='cog-button'>
					<img className='cog-img' src='/clockwise-arrow.png' />  // TODO
				</button>
			</div>
		</>
	)
}