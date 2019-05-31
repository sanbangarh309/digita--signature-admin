import React, { Component } from "react";
import swal from 'sweetalert';
import {
    Grid, Row, Col, Table, NavDropdown, MenuItem, Button, Modal, FormGroup, ControlLabel, FormControl} from "react-bootstrap";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Card from "components/Card/Card.jsx";
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
class Prices extends Component {
    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            token: localStorage.getItem('jwtToken'),
            prices: [],
            show: false,
            plan_type:'day',
            trial_type: 'day'
        }
    }
    componentWillMount() {
        this.getPrices();
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
        ['title', 'price', 'trial_dur', 'plan_dur', 'content', '_id'].map((elm)=>{
            this.setState({ [elm]: null });
        });
    }

    getPrices = () => {
        this.loaderToggle('show');
        axios.get(process.env.REACT_APP_API_URL + '/api/prices').then((res) => {
            this.setState({
                prices: res.data
            });
            this.loaderToggle('hide')
        }).catch(error => {
            swal("Error!", error.response.data.error, "error");
        });
    }

    deletePrice = (id, e) => {
        axios.delete(process.env.REACT_APP_API_URL + '/api/prices/' + id).then((res) => {
            var tbody = document.getElementById('price_table');
            tbody.removeChild(document.getElementById(id));
            swal("Deleted!", "Price has been deleted", "success");
        }).catch(error => {
            swal("Error!", "Something Went wrong", "error");
        });
    }

    loaderToggle = (action) => {
        if (action == 'hide') {
            let elem = document.getElementById('san_loader');
            elem.remove();
        } else {
            let elem = document.createElement('div');
            // elem.className = 'fa fa-spinner fa-spin fa-5x';
            elem.style.fontSize = '24px';
            elem.id = 'san_loader';
            document.body.insertBefore(elem, document.body.childNodes[0]);
        }
    }

    addPrice = (e) => {
        if (this.state.price && this.state.plan_dur) {
            axios.post(process.env.REACT_APP_API_URL + '/api/addprice', this.state).then((res) => {
                this.getPrices();
                this.setState({ show: false });
                let msg = 'Added';
                if (this.state._id) {
                    msg = 'Updated';
                }
                swal(msg, "Plan " + msg+" Successfully", "success");
            }).catch(error => {
                swal("Error!", error.response.data.error, "error");
            }); 
        }else{
            swal("Error!", "Something Went wrong", "error");
        }
        return false;
    }

    onChangeHandler = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    onEditorChange = (html) => {
        this.setState({ ['content']: html });
    }

    editPrice = (id,e) => {
        e.preventDefault();
        axios.get(process.env.REACT_APP_API_URL + '/api/edit/price/'+id, this.state).then((res) => {
            for (const key in res.data) {
                if (res.data.hasOwnProperty(key)) {
                    const element = res.data[key];
                    this.setState({ [key]: element });
                }
            }
            this.setState({ show: true });
            let header_title = document.getElementById('plan_modal');
            header_title.childNodes[0].childNodes[0].childNodes[0].innerHTML = 'Edit Plan';
            document.getElementById('button_title').innerHTML = 'Update Plan';
            // swal("Added!", "Price Added Successfully", "success");
        }).catch(error => {
            swal("Error!", error.response.data.error, "error");
        });
    } 

    render() {
        const modules = {
            toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image','color'],
                ['clean']
            ],
        };

        const formats = [
            'header',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image','color'
        ];
        return (
            <div className="content">
                <Grid fluid>
                    <Button variant="primary" onClick={this.handleShow}>
                        Add Plan
                    </Button>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="Price List"
                                ctTableFullWidth
                                ctTableResponsive
                                Card    content={
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th key={'0'}>Title</th>
                                                <th key={'0'}>Price</th>
                                                <th key={'1'}>Plan Duration</th>
                                                <th key={'2'}>Trial Duration</th>
                                                <th key={'3'}>Date</th>
                                                <th key={'4'}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="price_table">
                                            {this.state.prices.map((prop, key) => {
                                                return (
                                                    <tr key={prop._id} id={prop._id}>
                                                        <td key={key + 1}>{prop.title}</td>
                                                        <td key={key + 1}>{prop.price}</td>
                                                        <td key={key + 2}>{prop.plan_dur + ' ' + prop.plan_type}</td>
                                                        <td key={key + 3}>{prop.trial_dur + ' ' + prop.trial_type}</td>
                                                        <td key={key + 4}>{prop.created_at}</td>
                                                        <td key={key + 5}>
                                                            <NavDropdown
                                                                eventKey={2}
                                                                style={{ listStyle: 'none' }}
                                                                title="More"
                                                                id="basic-nav-dropdown-right"
                                                            >
                                                                <MenuItem onClick={this.deletePrice.bind(this, prop._id)} eventKey={2.1}>Delete</MenuItem>
                                                                <MenuItem onClick={this.editPrice.bind(this, prop._id)} eventKey={2.2}>Edit</MenuItem>
                                                            </NavDropdown>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Body id="plan_modal">
                        <Card
                            title="Add Plan"
                            content={
                                <form>
                                    <FormInputs
                                        ncols={["col-md-6", "col-md-6"]}
                                        proprieties={[
                                            {
                                                label: "Title",
                                                type: "text",
                                                name:"title",
                                                defaultValue: this.state.title,
                                                onChange: this.onChangeHandler.bind(this),
                                                bsClass: "form-control",
                                                placeholder: "Enter Plan Title"
                                            },
                                            {
                                                label: "Price",
                                                type: "text",
                                                bsClass: "form-control",
                                                name:'price',
                                                defaultValue: this.state.price,
                                                onChange:this.onChangeHandler.bind(this),
                                                placeholder: "Enter Price"
                                            },
                                        ]}
                                    />
                                    <Row>
                                        <Col md={3}>
                                            <FormGroup controlId="formControlsText">
                                                <ControlLabel>Trial Duration</ControlLabel>
                                                <FormControl
                                                    ref={select => { this.select = select }}
                                                    componentClass="input"
                                                    name="trial_dur"
                                                    defaultValue={this.state.trial_dur}
                                                    onChange={this.onChangeHandler.bind(this)}
                                                    placeholder= "Enter Trial Duration"
                                            />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup controlId="formControlsSelect">
                                                <ControlLabel>Select Period</ControlLabel>
                                                <FormControl
                                                    ref={select => { this.select = select }}
                                                    componentClass="select"
                                                    name="trial_type"
                                                    defaultValue={this.state.trial_type}
                                                    onChange={this.onChangeHandler.bind(this)}
                                                >
                                                    <option value="day">Days</option>
                                                    <option value="month">Month</option>
                                                    <option value="year">Year</option>
                                                </FormControl>
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup controlId="formControlsText">
                                                <ControlLabel>Plan Duration</ControlLabel>
                                                <FormControl
                                                    ref={select => { this.select = select }}
                                                    componentClass="input"
                                                    name= "plan_dur"
                                                    defaultValue={this.state.plan_dur}
                                                    placeholder="Enter Plan Duration"
                                                    onChange={this.onChangeHandler.bind(this)}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={3}>
                                            <FormGroup controlId="formControlsSelect">
                                                <ControlLabel>Select Period</ControlLabel>
                                                <FormControl
                                                    ref={select => { this.select = select }}
                                                    componentClass="select"
                                                    name="plan_type"
                                                    defaultValue={this.state.plan_type}
                                                    onChange={this.onChangeHandler.bind(this)}
                                                >
                                                    <option value="day">Days</option>
                                                    <option value="month">Month</option>
                                                    <option value="year">Year</option>
                                                </FormControl>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={12}>
                                            <FormGroup controlId="formControlsTextarea">
                                                <ControlLabel>Content</ControlLabel>
                                                <ReactQuill style={{ height: '50%' }} theme="snow" name="content" value={this.state.content || ''}
                                                    onChange={this.onEditorChange.bind(this)} modules={modules}
                                                    formats={formats} />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row style={{marginTop:'50px'}}>
                                        <Col md={12}>
                                            <Button bsStyle="info" onClick={this.addPrice.bind(this)} id="button_title" type="button">
                                                Add Price
                                            </Button>
                                            <Button variant="secondary" onClick={this.handleClose} style={{ float: 'right' }}>
                                                Cancel
                                            </Button>
                                        </Col>
                                        
                                    </Row>
                                    <div className="clearfix" />
                                </form>
                            }
                        />
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default Prices;
