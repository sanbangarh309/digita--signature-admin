import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";
import swal from 'sweetalert';
import { Card } from "components/Card/Card.jsx";
import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import avatar from "assets/img/fina-logo.png";
import axios from 'axios';
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('jwtToken'),
      email: null, firstname: null, lastname: null, mobile: null, mobilecountrycode: null, about:''
    }
  }
  componentWillMount() {
    this.getAdmin();
  }

  getAdmin = () => {
    this.loaderToggle('show');
    axios.post(process.env.REACT_APP_API_URL + '/api/admin', { token: this.state.token }).then((res) => {
      this.setState({ email: res.data.user.email, firstname: res.data.user.firstname, lastname: res.data.user.lastname, mobile: res.data.user.mobile, mobilecountrycode: res.data.user.mobilecountrycode, about: res.data.settings.about });
      this.loaderToggle('hide');
    }).catch(error => {
      this.loaderToggle('hide');
      swal("Error!", error.response.data.error, "error");
    });
  }

  updateAccount = (e) => {
    e.preventDefault();
    this.loaderToggle('show');
    axios.put(process.env.REACT_APP_API_URL + '/api/admin', this.state).then((res) => {
      this.setState({ email: res.data.user.email, firstname: res.data.user.firstname, lastname: res.data.user.lastname, mobile: res.data.user.mobile, mobilecountrycode: res.data.user.mobilecountrycode });
      this.loaderToggle('hide');
      swal("Updated", "Account Updated Successfully", "success");
    }).catch(error => {
      this.loaderToggle('hide');
      swal("Error!", error.response.data.error, "error");
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
  onChangeHandler = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  }

  onEditorChange = (html) => {
    this.setState({ about: html });
  }
  render() {
    const modules = {
      toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image', 'color'],
        ['clean']
      ],
    };

    const formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image', 'color'
    ];
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={8}>
              <Card
                title="Edit Profile"
                content={
                  <form>
                    <Row>
                      <Col md={4}>
                        <FormGroup controlId="formControlsText">
                          <ControlLabel>First Name</ControlLabel>
                          <FormControl
                            componentClass="input"
                            name="firstname"
                            value={this.state.firstname}
                            onChange={this.onChangeHandler.bind(this)}
                            placeholder="First Name"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup controlId="formControlsText">
                          <ControlLabel>Last Name</ControlLabel>
                          <FormControl
                            componentClass="input"
                            name="lastname"
                            value={this.state.lastname}
                            onChange={this.onChangeHandler.bind(this)}
                            placeholder="Last Name"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup controlId="formControlsText">
                          <ControlLabel>Email address</ControlLabel>
                          <FormControl
                            componentClass="input"
                            name="email"
                            value={this.state.email}
                            onChange={this.onChangeHandler.bind(this)}
                            placeholder="Email address"
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <FormGroup controlId="formControlsText">
                          <ControlLabel>Mobile</ControlLabel>
                          <FormControl
                            componentClass="input"
                            name="mobile"
                            value={this.state.mobile}
                            onChange={this.onChangeHandler.bind(this)}
                            placeholder="Mobile"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup controlId="formControlsText">
                          <ControlLabel>Mobile Country Code</ControlLabel>
                          <FormControl
                            componentClass="input"
                            name="mobilecountrycode"
                            value={this.state.mobilecountrycode}
                            onChange={this.onChangeHandler.bind(this)}
                            placeholder="Mobile Country Code"
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <FormGroup controlId="formControlsPassword">
                          <ControlLabel>Old Password</ControlLabel>
                          <input type="password" name="old_password" onChange={this.onChangeHandler.bind(this)} placeholder="OLd Password" id="formControlsPassword" className="form-control"/>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup controlId="formControlsPassword">
                          <ControlLabel>New Password</ControlLabel>
                          <input type="password" name="password" onChange={this.onChangeHandler.bind(this)} placeholder="New Password" id="formControlsPassword" className="form-control" />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <FormGroup controlId="formControlsTextarea">
                          <ControlLabel>About Me</ControlLabel>
                          <ReactQuill style={{ height: '50%' }} theme="snow" name="about" value={this.state.about}
                            onChange={this.onEditorChange.bind(this)} modules={modules}
                            formats={formats} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button bsStyle="info" type="button" onClick={this.updateAccount.bind(this)} style={{marginTop:'37px'}}>
                      Update Profile
                    </Button>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
            <Col md={4}>
              <UserCard
                avatar={avatar}
                name="Logo"
                userName="Digital Signature"
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Settings;
