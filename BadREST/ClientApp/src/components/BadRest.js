import React, { Component } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { Table, Button, Badge, Pager } from 'react-bootstrap';

export class BadRest extends Component {
    displayName = BadRest.name

    constructor(props) {
        super(props);
        this.state = {
            tweets: [],
            loading: false,
            startDate: new Date(),
            endDate: new Date(),
            perPage: 1000,
            currentPage: 1,
            totalPages: 0,
            totalCount: 0,
            displayContent: []
        };
    }

    submitRequest() {
        this.setState({ loading: true });
        fetch(`api/BadRest/Tweets?startDate=${this.state.startDate.toISOString()}&endDate=${this.state.endDate.toISOString()}`)
            .then(response => response.json())
            .then(data => {
                const totalCount = data.length;
                this.setState(prev => {
                    return {
                        tweets: data,
                        loading: false,
                        totalCount,
                        totalPages: Math.ceil(totalCount / prev.perPage),
                        currentPage: 1,
                        displayContent: this.renderTweets(1, data)
                    };
                });
            });
    }

    onPageChange(nextPage) {
        if (nextPage < 1 || nextPage > this.state.totalPages) {
            return;
        }

        this.setState({
            currentPage: nextPage,
            displayContent: this.renderTweets(nextPage, this.state.tweets)
        });
    }

    onChange(key, date) {
        this.setState({ [key]: date });
    }

    renderTweets(page, data) {
        const offset = (page - 1) * this.state.perPage;
        let count = 0;
        return (
            <Table striped responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Time</th>
                        <th>Text</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((tweet, index) => {
                            if (index >= offset && count < this.state.perPage) {
                                count++;
                                return (
                                    <tr key={tweet.id}>
                                        <td>{tweet.id}</td>
                                        <td>{tweet.stamp}</td>
                                        <td>{tweet.text}</td>
                                    </tr>
                                );
                            }
                        })
                    }
                </tbody>
            </Table>
        );
    }

    shouldAddPaginationItem(difference) {
        return this.state.currentPage + difference > 0 && this.state.currentPage + difference <= this.state.totalPages;
    }

    render() {
        const contents = this.state.loading ? "Loading..." : this.state.displayContent;
        
        return (
            <div>
                <h1>Tweets</h1>
                <span>Date Range:</span><DateTimePicker onChange={val => this.onChange('startDate', val)} value={this.state.startDate} />
                <span>-</span><DateTimePicker onChange={val => this.onChange('endDate', val)} value={this.state.endDate} />
                <Button bsStyle="primary" onClick={() => { this.submitRequest(); }} disabled={!(this.state.startDate && this.state.endDate)}>Submit</Button>
                <div>Item Count <Badge>{this.state.totalCount}</Badge></div>
                <div>Pages <Badge>{this.state.totalPages}</Badge></div>
                <div>Current Page <Badge>{this.state.currentPage}</Badge></div>
                <Pager>
                    <Pager.Item previous onClick={() => this.onPageChange(1)}>&larr; First</Pager.Item>
                    <Pager.Item previous onClick={() => this.onPageChange(this.state.currentPage - 1)}>&larr; Previous</Pager.Item>
                    {this.shouldAddPaginationItem(-2) > 0 && <Pager.Item>{this.state.currentPage - 2}</Pager.Item>}
                    {this.shouldAddPaginationItem(-1) && <Pager.Item>{this.state.currentPage - 1}</Pager.Item>}
                    <Pager.Item disabled>{this.state.currentPage}</Pager.Item>
                    {this.shouldAddPaginationItem(1) && <Pager.Item>{this.state.currentPage + 1}</Pager.Item>}
                    {this.shouldAddPaginationItem(2) && <Pager.Item>{this.state.currentPage + 2}</Pager.Item>}
                    <Pager.Item next onClick={() => this.onPageChange(this.state.totalPages)}>Last &rarr;</Pager.Item>
                    <Pager.Item next onClick={() => this.onPageChange(this.state.currentPage + 1)}>Next &rarr;</Pager.Item>
                </Pager>
                {contents}
            </div>
        );
    }
}
