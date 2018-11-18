import React, { Component } from 'react';
import { Button, Badge, Glyphicon, Well, Collapse } from 'react-bootstrap';
import '../index.css';

export class Details extends Component {

    constructor(...props) {
        super(...props);
        this.state = {
            showDetails: false
        }
    }

    toggleDetails() {
        this.setState({
            showDetails: !this.state.showDetails
        });
    }

    render() {
        return (
            <div>
                <Button className="details" bsStyle="info" onClick={() => this.toggleDetails()}>
                    Details <Glyphicon glyph="info-sign"></Glyphicon>
                </Button>
                <Collapse in={this.state.showDetails}>
                    <div>
                        <Well className="flex">
                            <div className="expand">Item Count<Badge className="smallMargin">{this.props.totalCount}</Badge></div>
                            <div className="expand">Pages<Badge className="smallMargin">{this.props.totalPages}</Badge></div>
                            <div>Current Page<Badge className="smallMargin">{this.props.currentPage}</Badge></div>
                        </Well>
                    </div>
                </Collapse>
            </div>
        );
    }
}
