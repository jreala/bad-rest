﻿import React, { Component } from 'react';
import { Button, ButtonToolbar, ButtonGroup, Glyphicon } from 'react-bootstrap';
import './PaginationButton.css';

export class PaginationButtons extends Component {

    /**
     * Navigate to new page
     *
     * @param {Number} nextPage
     * @return {Void}
     */
    __onPageChange(nextPage) {
        if (nextPage < 1 || nextPage > this.props.totalPages) {
            return;
        }

        this.props.update('pagination', {
            currentPage: nextPage
        });
    }

    /**
     * Determine if a button should be rendered
     *
     * @param {Number} difference
     * @return {Boolean}
     */
    __shouldAddPaginationItem(difference) {
        return this.props.currentPage + difference > 0 && this.props.currentPage + difference <= this.props.totalPages;
    }

    render() {
        return (
            <div className="wrapper">
                <div className="center">
                    <ButtonToolbar>
                        <ButtonGroup>
                            <Button bsStyle="primary" onClick={() => this.__onPageChange(1)}><Glyphicon glyph="backward" /></Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button bsStyle="primary" onClick={() => this.__onPageChange(this.props.currentPage - 1)}><Glyphicon glyph="chevron-left" /></Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            {this.__shouldAddPaginationItem(-2) && <Button onClick={() => this.__onPageChange(this.props.currentPage - 2)}>{this.props.currentPage - 2}</Button>}
                            {this.__shouldAddPaginationItem(-1) && <Button onClick={() => this.__onPageChange(this.props.currentPage - 1)}>{this.props.currentPage - 1}</Button>}
                            <Button bsStyle="primary" disabled>{this.props.currentPage}</Button>
                            {this.__shouldAddPaginationItem(1) && <Button onClick={() => this.__onPageChange(this.props.currentPage + 1)}>{this.props.currentPage + 1}</Button>}
                            {this.__shouldAddPaginationItem(2) && <Button onClick={() => this.__onPageChange(this.props.currentPage + 2)}>{this.props.currentPage + 2}</Button>}
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button bsStyle="primary" onClick={() => this.__onPageChange(this.props.currentPage + 1)}><Glyphicon glyph="chevron-right" /></Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button bsStyle="primary" onClick={() => this.__onPageChange(this.props.totalPages)}><Glyphicon glyph="forward" /></Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                </div>
            </div>
        );
    }
}
