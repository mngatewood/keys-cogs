import React from 'react';
import { Meteor } from 'meteor/meteor';
import { RoundResults } from '../components/RoundResults';
import type { GameType, PlayerType, RoundResultsType } from '../../api/types';
import { getAllPlayersInPlayerRoundReady } from '/imports/helpers/gameplay';
import { useTracker } from 'meteor/react-meteor-data';

interface WaitingOverlayProps {
	game: GameType,
	advanceRound: Function,
	roundResults: RoundResultsType,
}

export const WaitingOverlay = ({game, advanceRound, roundResults}: WaitingOverlayProps) => {

	const user = useTracker(() => Meteor.user(), []);

	const handleAdvanceRound = () => {
		advanceRound();
	}

	const renderedMessage = () => {
		if (roundResults.message) {
			return roundResults.message.split("<br>")
		}
	}

	const disableAdvanceButton = () => {
		if (!user) return true;
		if (game.isDemo) return false;
		const player = game.players.find((player) => player._id === user?._id);
		const allPlayersInPlayerRoundReady = getAllPlayersInPlayerRoundReady(game, user?._id);
		const playersInPreviousRounds = game.players.reduce((acc: PlayerType[], gamePlayer: PlayerType) => {
			return gamePlayer.round < player.round ? true : acc
		}, false)

		if (player?.ready && allPlayersInPlayerRoundReady && !playersInPreviousRounds) {
			return false;
		} else {
			return true;
		}
	}

	return (
		<div className="full-screen w-full fixed top-0 left-0 flex items-center justify-center z-50 bg-blue-1 bg-opacity-50 ">
			<div className="waiting-overlay-container flex flex-col justify-evenly items-center bg-beige-1 shadow-lg border border-gray-300 rounded-lg px-8 py-6 m-auto w-5/6 max-w-md">
				<h1 className="text-2xl font-bold text-center mb-4">
					{ !disableAdvanceButton() ? "All players ready" : 
						renderedMessage()?.map((message, index) => <p key={`${index}-${message.split(" ")[0]}`}>{message}</p>)
					}
				</h1>
				{roundResults.roundComplete && roundResults.incorrectPositions &&
					<RoundResults roundResults={roundResults} />
				}
				<button disabled={disableAdvanceButton()} onClick={handleAdvanceRound} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-1 disabled:bg-rosegold-2 disabled:text-gray-400 hover:bg-blue-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-1">
					{ roundResults.finalRound
						? "View Game Results"
						: "Start Next Round"
					}
				</button>
			</div>
		</div>
	)
}
