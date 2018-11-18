﻿import React, { Component } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { Table, Button, ButtonToolbar, ButtonGroup, Badge, Panel, Glyphicon, Well, Collapse, InputGroup, FormControl, Grid, Row, Col } from 'react-bootstrap';
import '../index.css';

export class DateRange extends Component {

    constructor(...props) {
        super(...props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate
        }
    }

    onDateChange(key, date) {
        const newState = { [key]: date };
        this.setState(newState);
        this.props.update(newState);
    }

    render() {
        return (
            <Panel>
                <h4>Date Range</h4>
                <DateTimePicker onChange={val => this.onDateChange('startDate', val)} value={this.state.startDate} />
                <span className="smallMargin">-</span>
                <DateTimePicker onChange={val => this.onDateChange('endDate', val)} value={this.state.endDate} />
                <Button bsStyle="primary" className="smallMargin" onClick={() => this.props.submitRequest()} disabled={!(this.state.startDate && this.state.endDate)}>Submit</Button>
            </Panel>
        );
    }
}