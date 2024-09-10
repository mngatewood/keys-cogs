import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableProps {
	children: React.ReactNode;
	key: string;
	id: string;
}
export const Droppable: React.FC<DroppableProps> = (props) => {
	const { id, children } = props;
	const { isOver, setNodeRef } = useDroppable({
		id: id,
	});
	const style = {
		backgroundColor: isOver ? 'pink' : undefined,
	};


	return (
		<div id={props.id} className="droppable" ref={setNodeRef} style={style}>
			{children}
		</div>
	);
}