import React, { useEffect, useState } from 'react';

interface EditKeyProps {
	updateForm: Function
	keyId: number
	keyValue: string
}


export const EditKey: React.FC<EditKeyProps> = ({ updateForm, keyId, keyValue }) => {
	const [input, setInput] = useState(keyValue);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(true);
		const input = document.querySelector(".edit-key-input") as HTMLInputElement | null;
		input?.focus();
	}, [])

	const handleClickCancel = () => {
		setIsVisible(false);
		setTimeout(() => updateForm("cancel", keyId, ""), 500); 
	}
	
	const handleClickSave = () => {
		setIsVisible(false);
		setTimeout(() => updateForm("save", keyId, input), 500); 
	}

	const handleInputChange = (e: any) => {
		setInput(e.target.value);
	}

	const addOrEditLabel = input === "" ? "Add Key" : "Edit Key";

	return (
		<div style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.5s ease-in-out', }} className="edit-key-container z-top">
			<label className="edit-key-label">{addOrEditLabel}</label>
			<input className="edit-key-input" type="text" value={input} onChange={handleInputChange}/>
			<div className="edit-key-buttons-container">
				<button className="edit-key-button cancel" onClick={handleClickCancel}>Cancel</button>
				<button className="edit-key-button submit" onClick ={handleClickSave}>Save</button>
			</div>
		</div>
	)
}