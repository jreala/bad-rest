import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Jumbotron, Button } from 'react-bootstrap';

export class Home extends Component {
    displayName = Home.name

    render() {
        return (
            <Jumbotron>
                <h1>Bad REST API</h1>
                <p>Interview Project for IQVIA, by Jason Eala</p>
                <p>
                    This project was made using Visual Studio 2017 Community, based on the .NET Core & React template.
                </p>
                <p>
                    <b>The Problem: </b>
                    <br />
                    A Client needs us to pull 2 years of ultra-cool curated tweets they have collected and stored themselves.
                    We need to make sure that we get all tweets tweeted in 2016 and 2017.
                    The only way to get this data is to use the client's REST API, but it's not a well-designed API...
                </p>
                <LinkContainer to={'/badrest'}>
                    <Button bsStyle='primary'>Get Started</Button>
                </LinkContainer>
            </Jumbotron>
        );
    }
}
