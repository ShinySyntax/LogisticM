import React from 'react'
import { useParams } from "react-router-dom";

class TokenDetail extends React.Component {
	render () {
		// let { tokenId } = useParams
		return (
			<p>The token is: <em>{this.props.match.params.tokenId}</em></p>
		)
	}
}

export default TokenDetail;
