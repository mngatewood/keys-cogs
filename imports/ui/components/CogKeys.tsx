import React, { useState } from 'react';
import { TransitionGroup, CSSTransition } from "react-transition-group";

interface CogKeysProps {
	updateKeys: Function
	keys: Array<string>
}

export const CogKeys: React.FC<CogKeysProps> = ({updateKeys, keys}) => {
	const [inputValue, setInputValue] = useState(keys[0]);
	
	const handleKeyUpdate = () => {
		updateKeys(inputValue)
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
						<input
							type="text"
							className='key-input'
							placeholder='*hint*'
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onBlur={handleKeyUpdate}
						/>
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
						<div className="animate-key">{keys[2]}</div>
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
						<div className="animate-key">{keys[4]}</div>
					</CSSTransition>
				</TransitionGroup>
			</div>
		</>
	)
}