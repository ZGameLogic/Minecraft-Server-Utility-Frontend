import React from 'react';
import Figure from 'react-bootstrap/Figure';
import {Card, Stack} from 'react-bootstrap';
import {PlayerLineProps} from '../constants/Types';

function MinecraftPlayerLine(props: PlayerLineProps){
	return <Stack direction="horizontal" gap={3}>
		<Figure.Image
			width={20}
			height={20}
			alt="20x20"
			src={`https://mc-heads.net/avatar/${props.player}/20`}
			className={'playerList'}
		/>
		<Card.Text>{props.player}</Card.Text>
	</Stack>;
}

export default MinecraftPlayerLine;