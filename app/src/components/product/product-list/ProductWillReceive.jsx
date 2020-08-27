import React from 'react'
import { ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

import WillReceiveProductItem from '../product-item/WillReceiveProductItem';

class ProductWillReceive extends React.Component {
	render () {
		return (
			<ListGroup>
				{this.props.productHashList.map((productHash, idx) => {
					return (
						<WillReceiveProductItem
							key={idx}
							drizzle={this.props.drizzle}
							drizzleState={this.props.drizzleState}
							productHash={productHash}
						/>
					)
				})}
			</ListGroup>
		)
	}
}

ProductWillReceive.propTypes = {
	productHashList: PropTypes.array
};

export default ProductWillReceive;
