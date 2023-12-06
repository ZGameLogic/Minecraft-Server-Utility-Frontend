import React from 'react';
import PropTypes from 'prop-types';
import Figure from 'react-bootstrap/Figure';
import {CardText, Stack} from 'react-bootstrap';
function MinecraftPlayerLine(props){
	return <Stack direction="horizontal" gap={3}>
		<Figure.Image
			width={20}
			height={20}
			alt="20x20"
			src={`https://mc-heads.net/avatar/${props.player}/20`}
			className={'playerList'}
		/>
		<CardText>{props.player}</CardText>
	</Stack>;
}

MinecraftPlayerLine.propTypes = {
	player: PropTypes.string
};

export default MinecraftPlayerLine;