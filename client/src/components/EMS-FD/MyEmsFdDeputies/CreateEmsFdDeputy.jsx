import React, { Component } from 'react';
import Axios from 'axios';
import { backendURL } from '../../../config/config';
import Cookies from 'js-cookie';

export default class CreateEmsFdDeputy extends Component {
  constructor() {
    super();

    this.state = {
      deputyName: '',
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    Axios({
      url: backendURL + '/ems-fd/add',
      method: 'POST',
      headers: {
        'x-auth-snailycad-token': Cookies.get('__session'),
      },
      data: {
        deputyName: this.state.deputyName,
      },
    }).then((res) => {
      if (res.data.msg === 'Added Deputy') {
        sessionStorage.setItem(
          'ems-fd-message',
          'Successfully Created ' + this.state.deputyName
        );
        return (window.location = '/ems-fd/deputies');
      }
    });
  };

  componentDidMount() {
    document.title = 'Create EMS/FD Deputy - EMS/FD';
  }

  render() {
    const { deputyName } = this.state;
    return (
      <form onSubmit={this.onSubmit} className='container text-light'>
        <div className='form-group'>
          <label htmlFor='deputyName'>Enter Deputy Name</label>
          <input
            className='form-control text-light bg-dark border-secondary'
            placeholder='Deputy Name'
            type='text'
            name='deputyName'
            id='deputyName'
            value={deputyName}
            onChange={this.onChange}
          />
        </div>

        <div className='form-group float-right'>
          <a className='btn btn-danger' href='/ems-fd/deputies'>
            Cancel
          </a>
          <button className='btn btn-primary ml-2' type='submit'>
            Create Deputy
          </button>
        </div>
      </form>
    );
  }
}
