import React, { useState } from 'react';

interface EditKeyProps {
	updateForm: Function
	keyId: number
	keyValue: string
}


export const EditKey: React.FC<EditKeyProps> = ({ updateForm, keyId, keyValue }) => {
	const [input, setInput] = useState(keyValue);

	const handleClickCancel = () => {
		updateForm("cancel", keyId, "")
	}
	
	const handleClickSave = () => {
		updateForm("save", keyId, input)
	}

	const handleInputChange = (e: any) => {
		setInput(e.target.value);
	}

	const addOrEditLabel = input === "" ? "Add Key" : "Edit Key";

	return (
		<div className="edit-key-container z-top">
			{/* <div className="edit-key-input-container"> */}
				<label className="edit-key-label">{addOrEditLabel}</label>
				<input className="edit-key-input" type="text" value={input} onChange={handleInputChange}/>
			{/* </div> */}
			<div className="edit-key-buttons-container">
				<button className="edit-key-button cancel" onClick={handleClickCancel}>Cancel</button>
				<button className="edit-key-button submit" onClick ={handleClickSave}>Save</button>
			</div>
		</div>
)
}