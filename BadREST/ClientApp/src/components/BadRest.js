import React, { Component } from 'react';
import { DateRange } from './DateRange';
import { Table, Glyphicon, InputGroup, FormControl } from 'react-bootstrap';
import '../index.css';
import { Details } from './Details';
import { PaginationButtons } from './PaginationButtons';

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
            case 'details':
                break;
            case 'dateRange':
                break;
            case 'pagination':
                this.setState({
                    displayContent: this.renderTweets(state.currentPage, this.state.tweets)
                });
                break;
            case 'jump':
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





    handleJump(target) {
        if (!target || target < 1 || target > this.state.totalPages) {
            return;
        }

        this.onPageChange(parseInt(target));
        this.setState({ currentPage: target });
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


    renderPageJump() {
        return (
            <div className="jumpBox">
                <InputGroup>
                    <FormControl type="text" placeholder="Jump To Page..." onChange={e => this.handleJump(parseInt(e.target.value))} />
                    <InputGroup.Addon>
                        <Glyphicon glyph="search"></Glyphicon>
                    </InputGroup.Addon>
                </InputGroup>
            </div>
        );
    }

    render() {
        const contents = this.state.loading ? "Loading..." : this.state.displayContent;
        return (
            <div>
                <h1>Tweets</h1>
                <DateRange startDate={new Date()} endDate={new Date()} update={(from, state) => this.update(from, state)} submitRequest={() => this.submitRequest()} />
                {this.state.totalCount > 0 && <Details currentPage={this.state.currentPage} totalPages={this.state.totalPages} totalCount={this.state.totalCount} />}
                {this.state.totalCount > 0 && this.renderPageJump()}
                {this.state.totalCount > 0 && <PaginationButtons currentPage={this.state.currentPage} totalPages={this.state.totalPages} update={(from, state) => this.update(from, state)}/>}
                {contents}
                {this.state.totalCount > 0 && this.renderPageJump()}
                {this.state.totalCount > 0 && <PaginationButtons currentPage={this.state.currentPage} totalPages={this.state.totalPages} update={(from, state) => this.update(from, state)} />}
            </div>
        );
    }
}
