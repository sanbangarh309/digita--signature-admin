import React, { Component } from "react";
import swal from 'sweetalert';
import { Grid, Row, Col, Table, NavDropdown, MenuItem } from "react-bootstrap";


import Card from "components/Card/Card.jsx";
// import { thArray, tdArray } from "variables/Variables.jsx";
import axios from 'axios';
class Signers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('jwtToken'),
      signers:[],
      pageLimit: 4,
      currentPage: 1,
      current_pages: null,
      total_records: 0,
    }
  }
  componentWillMount() {
    this.getSigners();
  }

  getSigners = (page=1) => {
    this.loaderToggle('show');
    axios.post(process.env.REACT_APP_API_URL + '/api/signers', { token: this.state.token, page: page ? page : this.state.currentPage, pageLimit: this.state.pageLimit }).then((res) => {
      this.setState({
        signers: res.data.signers, current_pages: res.data.page, total_records: res.data.total_pages
      });
      this.loaderToggle('hide');
    }).catch(error => {
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

  deleteSigner = (id, e) => {
    axios.delete(process.env.REACT_APP_API_URL + '/api/signer/' + id).then((res) => {
      this.getSigners();
      swal("Deleted!", "Signer has been deleted", "success");
    }).catch(error => {
      swal("Error!", "Something Went wrong", "danger");
    });
  }

  handleClick = (action, e) => {
    let targetid = e.target.id;
    if (!e.target.id) {
      var children = e.target.parentElement.children;
      for (var i = 0; i < children.length; i++) {
        var tableChild = children[i];
        if (tableChild.className.includes('active')) {
          targetid = tableChild.id;
        }
      }
      if (action == 'next') {
        targetid = parseInt(targetid) + 1;
      }
      if (action == 'prev') {
        targetid = parseInt(targetid) - 1;
      }
    }
    this.getSigners(targetid);
    this.setState({
      currentPage: Number(targetid)
    });
  }

  render() {
    let renderPageNumbers;
    if (this.state.total_records > this.state.pageLimit) {
      const pageNumbers = [];
      for (let i = 1; i <= this.state.current_pages; i++) {
        pageNumbers.push(i);
      }
      renderPageNumbers = pageNumbers.map(number => {
        let activeClass_ = '';
        if (this.state.currentPage == number) {
          activeClass_ = 'active';
        }
        return (
          <a key={number}
            id={number}
            onClick={this.handleClick.bind(this, 'current')}
            href="javascript:void(0)" className={activeClass_}>{number}</a>
        );
      });
    }
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Documents List"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th key={'0'}>Name</th>
                        <th key={'1'}>Email</th>
                        <th key={'2'}>Added By</th>
                        <th key={'3'}>Date</th>
                        <th key={'4'}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.signers.map((prop, key) => {
                        return (
                          <tr key={key}>
                            <td key={key+1}>{prop.name}</td>
                            <td key={key+2}>{prop.email}</td>
                            <td key={key + 2}>{prop.added_by.lastname}</td>
                            <td key={key+3}>{prop.created_at}</td>
                            <td key={key + 4}>
                            <NavDropdown
                              eventKey={2}
                              style={{ listStyle: 'none' }}
                              title="More"
                              id="basic-nav-dropdown-right"
                            >
                                <MenuItem onClick={this.deleteSigner.bind(this, prop._id)} eventKey={2.1}>Delete</MenuItem>
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
          <Row>
                        {(() => {
                            let disablesFields = {};
                            let disablesFieldsprev = {};
                            if ((this.state.currentPage * this.state.pageLimit) == this.state.total_records) {
                                disablesFieldsprev['pointerEvents'] = 'none';
                                disablesFieldsprev['color'] = 'burlywood';
                            }
              if (this.state.currentPage == this.state.current_pages && this.state.signers.length <= this.state.pageLimit) {
                                disablesFieldsprev['pointerEvents'] = 'none';
                                disablesFieldsprev['color'] = 'burlywood';
                            }
                            if (this.state.currentPage <= 1) {
                                disablesFields['pointerEvents'] = 'none';
                                disablesFields['color'] = 'burlywood';
                            }
                            if (this.state.total_records > this.state.pageLimit) {
                                return (<div className="pagination">
                                    <a href="javascript:void(0)" style={disablesFields} onClick={this.handleClick.bind(this, 'prev')}>&laquo;</a>
                                    {renderPageNumbers}
                                    <a href="javascript:void(0)" style={disablesFieldsprev} onClick={this.handleClick.bind(this, 'next')}>&raquo;</a>
                                </div>)
                            }
                        })()}
                    </Row>
        </Grid>
      </div>
    );
  }
}

export default Signers;
