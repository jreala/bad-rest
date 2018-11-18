import React, { Component } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { Table, Button, ButtonToolbar, ButtonGroup, Badge, Panel, Glyphicon, Well, Collapse, InputGroup, FormControl, Grid, Row, Col } from 'react-bootstrap';
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

    handleJump(target) {
        if (!target || target < 1 || target > this.state.totalPages) {
            return;
        }

        this.onPageChange(parseInt(target));
        this.setState({ currentPage: target });
    }

    toggleDetails() {
        this.setState({
            showDetails: !this.state.showDetails
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

    shouldAddPaginationItem(difference) {
        return this.state.currentPage + difference > 0 && this.state.currentPage + difference <= this.state.totalPages;
    }

    renderPaginationButtons() {
        return (
            <div className="wrapper">
                <div className="center">
                    <ButtonToolbar>
                        <ButtonGroup>
                            <Button bsStyle="primary" onClick={() => this.onPageChange(1)}><Glyphicon glyph="backward" /></Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button bsStyle="primary" onClick={() => this.onPageChange(this.state.currentPage - 1)}><Glyphicon glyph="chevron-left" /></Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            {this.shouldAddPaginationItem(-2) && <Button onClick={() => this.onPageChange(this.state.currentPage - 2)}>{this.state.currentPage - 2}</Button>}
                            {this.shouldAddPaginationItem(-1) && <Button onClick={() => this.onPageChange(this.state.currentPage - 1)}>{this.state.currentPage - 1}</Button>}
                            <Button bsStyle="primary" disabled>{this.state.currentPage}</Button>
                            {this.shouldAddPaginationItem(1) && <Button onClick={() => this.onPageChange(this.state.currentPage + 1)}>{this.state.currentPage + 1}</Button>}
                            {this.shouldAddPaginationItem(2) && <Button onClick={() => this.onPageChange(this.state.currentPage + 2)}>{this.state.currentPage + 2}</Button>}
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button bsStyle="primary" onClick={() => this.onPageChange(this.state.currentPage + 1)}><Glyphicon glyph="chevron-right" /></Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button bsStyle="primary" onClick={() => this.onPageChange(this.state.totalPages)}><Glyphicon glyph="forward" /></Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
            </div>
        );
    }

    renderDetails() {
        return (
            <div>
                <Button className="details" bsStyle="info" onClick={() => this.toggleDetails()}>
                    Details <Glyphicon glyph="info-sign"></Glyphicon>
                </Button>
                <Collapse in={this.state.showDetails}>
                    <div>
                        <Well className="flex">
                            <div className="expand">Item Count<Badge className="smallMargin">{this.state.totalCount}</Badge></div>
                            <div className="expand">Pages<Badge className="smallMargin">{this.state.totalPages}</Badge></div>
                            <div>Current Page<Badge className="smallMargin">{this.state.currentPage}</Badge></div>
                        </Well>
                    </div>
                </Collapse>
            </div>
        );
    }

    renderDateTimePicker() {
        return (
            <Panel>
                <h4>Date Range</h4>
                <DateTimePicker onChange={val => this.onChange('startDate', val)} value={this.state.startDate} />
                <span className="smallMargin">-</span>
                <DateTimePicker onChange={val => this.onChange('endDate', val)} value={this.state.endDate} />
                <Button bsStyle="primary" className="smallMargin" onClick={() => { this.submitRequest(); }} disabled={!(this.state.startDate && this.state.endDate)}>Submit</Button>
            </Panel>
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
                {this.renderDateTimePicker()}
                {this.state.totalCount > 0 && this.renderDetails()}
                {this.state.totalCount > 0 && this.renderPageJump()}
                {this.state.totalCount > 0 && this.renderPaginationButtons()}
                {contents}
                {this.state.totalCount > 0 && this.renderPageJump()}
                {this.state.totalCount > 0 && this.renderPaginationButtons()}
            </div>
        );
    }
}
