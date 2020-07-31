import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Navbar, Nav, Form, FormControl, Button, Badge } from 'react-bootstrap';
import { newContextComponents } from "@drizzle/react-components";

import Address from "./product/Address"

const { AccountData } = newContextComponents;

export default function({ drizzle, drizzleState }) {
	const [pathSearch, setPathSearch] = useState("");

	return (
		<Navbar bg="light" expand="md">
			<Navbar.Brand><Link to="/">Logistic</Link></Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Form inline>
					<FormControl
						type="text"
						placeholder="Search a product"
						className="mr-sm-2"
						size="sm"
						htmlSize={8}
						onChange={event => setPathSearch(`/product/${event.target.value}`)}
					/>
					<Link to={pathSearch}>
						<Button variant="outline-success" size="sm">
							Search
						</Button>
					</Link>
				</Form>
				<Nav className="ml-auto">
					<AccountData
						drizzle={drizzle}
						drizzleState={drizzleState}
						accountIndex={0}
						units="ether"
						precision={5}
						render={({address, balance, units}) => {
							return (
								<p>
									<Address
										drizzle={drizzle}
										drizzleState={drizzleState}
										address={address}
									/>
									<br/>
									<Badge variant="secondary">{balance}</Badge> {units} (Ξ)
								</p>
							)
						}}
						/>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	)
}
