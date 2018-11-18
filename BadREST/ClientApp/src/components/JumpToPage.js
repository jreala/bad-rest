import React, { Component } from 'react';
import { Glyphicon, InputGroup, FormControl } from 'react-bootstrap';
import './JumpToPage.css';

export class JumpToPage extends Component {

    /**
     * Jump to new page
     *
     * @param {Number} target
     * @return {Void}
     */
    __handleJump(target) {
        if (!target || target < 1 || target > this.props.totalPages) {
            return;
        }

        this.props.update('jump', {
            currentPage: target
        });
    }

    render() {
        return (
            <div className="jumpBox">
                <InputGroup>
                    <FormControl type="text" placeholder="Jump To Page..." onChange={e => this.__handleJump(parseInt(e.target.value, 10))} />
                    <InputGroup.Addon>
                        <Glyphicon glyph="search"></Glyphicon>
                    </InputGroup.Addon>
                </InputGroup>
            </div>
        );
    }
}
