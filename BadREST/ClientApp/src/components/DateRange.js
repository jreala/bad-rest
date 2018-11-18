import React, { Component } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { Button, Panel } from 'react-bootstrap';
import './Common.css'

export class DateRange extends Component {

    constructor(...props) {
        super(...props);
        this.state = {
            startDate: this.props.startDate,
            endDate: this.props.endDate
        }
    }

    /**
     * Update state when date changes
     *
     * @param {String} key
     * @param {String} date
     * @return {Void}
     */
    __onDateChange(key, date) {
        const newState = { [key]: date };
        this.setState(newState);
        this.props.update('dateRange', newState);
    }

    render() {
        return (
            <Panel>
                <h4>Date Range</h4>
                <DateTimePicker onChange={val => this.__onDateChange('startDate', val)} value={this.state.startDate} />
                <span className="smallMargin">-</span>
                <DateTimePicker onChange={val => this.__onDateChange('endDate', val)} value={this.state.endDate} />
                <Button bsStyle="primary" className="smallMargin" onClick={() => this.props.submitRequest()} disabled={!(this.state.startDate && this.state.endDate)}>Submit</Button>
            </Panel>
        );
    }
}
