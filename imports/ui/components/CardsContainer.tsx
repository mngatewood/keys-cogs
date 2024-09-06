import React, { Component } from 'react';
import { KeyCard } from './KeyCard';

export class CardsContainer extends Component<{ selectedCards: Array<Card> }> {
	state = {
		cards: []
  	};

	componentDidMount() {
		const { selectedCards } = this.props;
		console.log("selectedCards in CardsContainer", selectedCards)
		const cards = selectedCards.map((card) => {
			return <KeyCard key={card._id} {...card} />;
		});
		this.setState({ cards });
	}

	render() {
		return (
			<div className='cards-container'>
				{this.state.cards}
			</div>
		);
	}
	}