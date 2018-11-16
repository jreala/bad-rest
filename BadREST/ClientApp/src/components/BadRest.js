import React, { Component } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { Button } from 'react-bootstrap';

export class BadRest extends Component {
    displayName = BadRest.name

    constructor(props) {
        super(props);
        this.state = {
            tweets: [],
            loading: true,
            startDate: new Date(),
            endDate: new Date()
        };
    }

    submitRequest() {
        console.log(this);
        console.log(this.state);
        fetch(`api/BadRest/Tweets?startDate=${this.state.startDate.toISOString()}&endDate=${this.state.endDate.toISOString()}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({ tweets: data, loading: false });
            });
    }

    onChange(key, date) {
        this.setState({ [key]: date });
        console.log(this.state);
    }

    static renderTweets(data) {
        return (
            <table className='table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Time</th>
                        <th>Text</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(tweet =>
                        <tr key={tweet.id}>
                            <td>{tweet.id}</td>
                            <td>{tweet.stamp}</td>
                            <td>{tweet.text}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : BadRest.renderTweets(this.state.tweets);

        return (
            <div>
                <h1>Tweets</h1>
                <span>Date Range: </span><DateTimePicker onChange={val => this.onChange('startDate', val)} value={this.state.startDate} />
                <span> - </span><DateTimePicker onChange={val => this.onChange('endDate', val)} value={this.state.endDate} />
                <Button bsStyle="primary" onClick={() => { this.submitRequest(); }} >Submit</Button>
                {contents}
            </div>
        );
    }
}
