import React, { Component } from 'react';
import { Glyphicon, InputGroup, FormControl } from 'react-bootstrap';
import '../index.css';

export class JumpToPage extends Component {

    handleJump(target) {
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
                    <FormControl type="text" placeholder="Jump To Page..." onChange={e => this.handleJump(parseInt(e.target.value, 10))} />
                    <InputGroup.Addon>
                        <Glyphicon glyph="search"></Glyphicon>
                    </InputGroup.Addon>
                </InputGroup>
            </div>
        );
    }
}
