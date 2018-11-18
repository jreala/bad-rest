import React, { Component } from 'react';
import { DateRange } from './DateRange';
import { Table } from 'react-bootstrap';
import { Details } from './Details';
import { PaginationButtons } from './PaginationButtons';
import { JumpToPage } from './JumpToPage';
import '../index.css';

export class BadRest extends Component {
    displayName = BadRest.name

    constructor(props) {
        super(props);
        this.state = {
            tweets: [],
            loading: false,
            startDate: new Date(),
            endDate: new Date(),
            perPage: 50,
            currentPage: 0,
            totalPages: 0,
            totalCount: 0,
            displayContent: [],
            showDetails: false
        };
    }

    update(from, state) {
        switch (from) {
            case 'jump':
            case 'pagination':
                this.setState({
                    displayContent: this.renderTweets(state.currentPage, this.state.tweets)
                });
                break;
            default:
                break;
        }
        this.setState(state);
    }

    submitRequest() {
        this.setState({ loading: true });
        console.log(this.state);
        fetch(`api/BadRest/Tweets?startDate=${this.state.startDate.toISOString()}&endDate=${this.state.endDate.toISOString()}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
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

    render() {
        const contents = this.state.loading ? "Loading..." : this.state.displayContent;
        return (
            <div>
                <h1>Tweets</h1>
                <DateRange startDate={new Date()} endDate={new Date()} update={(from, state) => this.update(from, state)} submitRequest={() => this.submitRequest()} />
                {this.state.totalCount > 0 && <Details currentPage={this.state.currentPage} totalPages={this.state.totalPages} totalCount={this.state.totalCount} />}
                {this.state.totalCount > 0 && <JumpToPage totalPages={this.state.totalPages} update={(from, state) => this.update(from, state)} />}
                {this.state.totalCount > 0 && <PaginationButtons currentPage={this.state.currentPage} totalPages={this.state.totalPages} update={(from, state) => this.update(from, state)} />}
                {contents}
                {this.state.totalCount > 0 && <JumpToPage totalPages={this.state.totalPages} update={(from, state) => this.update(from, state)} />}
                {this.state.totalCount > 0 && <PaginationButtons currentPage={this.state.currentPage} totalPages={this.state.totalPages} update={(from, state) => this.update(from, state)} />}
            </div>
        );
    }
}
