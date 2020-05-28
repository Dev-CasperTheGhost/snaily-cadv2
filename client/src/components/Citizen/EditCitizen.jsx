import React, { Component } from 'react';
import axios from 'axios';
import { backendURL } from '../../config/config';
import Cookies from 'js-cookie';
import ErrorMessage from '../Partials/Messages/ErrorMessage';

export default class EditCitizen extends Component {
  constructor() {
    super();

    this.state = {
      error: '',
      genders: [],
      ethnicities: [],
      statuses: [],
      fullName: '',
      birth: '',
      ethnicity: '',
      gender: '',
      hairColor: '',
      eyeColor: '',
      address: '',
      height: '',
      weight: '',
      image: '',
    };
  }

  getCitizenData = () => {
    const citizenId = this.props.match.params.citizenId;
    axios({
      url: backendURL + '/citizen/' + citizenId,
      headers: {
        'x-auth-snailycad-token': Cookies.get('__session'),
      },
    })
      .then((res) => {
        if (res.data.msg === 'Forbidden') {
          sessionStorage.setItem(
            'message',
            "This citizen is not linked to your account, Therefore you can't edit this citizen."
          );
          return (window.location = '/citizen');
        }

        if (res.data.msg === 'Citizen Not Found') {
          sessionStorage.setItem('message', 'Citizen Was not found!');
          return (window.location = '/citizen');
        }

        if (res.data.citizen) {
          const citizen = res.data.citizen[0];
          this.setState({
            citizenId: citizen.id,
            address: citizen.address,
            birth: citizen.birth,
            employer: citizen.business,
            ccw: citizen.ccw,
            picture: citizen.citizen_picture,
            dmv: citizen.dmv,
            ethnicity: citizen.ethnicity,
            eyeColor: citizen.eye_color,
            firearmsLicense: citizen.fire_license,
            fullName: citizen.full_name,
            gender: citizen.gender,
            hairColor: citizen.hair_color,
            height: citizen.height,
            pilotLicense: citizen.pilot_license,
            weight: citizen.weight,
          });

          // Set the title
          document.title = 'Editing: ' + citizen.full_name;
        }

        this.setState({
          loading: false,
        });
      })
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    // Get all the data
    this.getCitizenData();
    this.getGenders();
    this.getEthnicities();
  }

  getGenders = () => {
    axios({
      url: backendURL + '/admin/genders',
      headers: {
        'x-auth-snailycad-token': Cookies.get('__session'),
      },
    }).then((res) => {
      this.setState({
        genders: res.data.genders,
      });
    });
  };

  getEthnicities = () => {
    axios({
      url: backendURL + '/admin/ethnicities',
      headers: {
        'x-auth-snailycad-token': Cookies.get('__session'),
      },
    }).then((res) => {
      this.setState({
        ethnicities: res.data.ethnicities,
      });
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  updateCitizen = (event) => {
    event.preventDefault();

    const citizenId = this.props.match.params.citizenId;
    const url = `${backendURL}/citizen/${citizenId}`;

    const fd = new FormData();
    if (this.state.image) {
      fd.append('image', this.state.image, this.state.image.name);
    }
    fd.append('fullName', this.state.fullName);
    fd.append('birth', this.state.birth);
    fd.append('gender', this.state.gender);
    fd.append('ethnicity', this.state.ethnicity);
    fd.append('hairColor', this.state.hairColor);
    fd.append('eyeColor', this.state.eyeColor);
    fd.append('address', this.state.address);
    fd.append('height', this.state.height);
    fd.append('weight', this.state.weight);

    axios
      .put(url, fd, {
        headers: {
          'x-auth-snailycad-token': Cookies.get('__session'),
        },
      })
      .then((res) => {
        if (res.data.msg === 'Citizen Updated') {
          sessionStorage.setItem(
            'message',
            'Successfully Updated ' + this.state.fullName
          );
          return (window.location = '/citizen');
        }

        this.setState({
          error: res.data.msg,
        });
      })
      .catch((err) => console.log(err));

    // axios({
    //   url: backendURL + '/citizen/' + citizenId,
    //   method: 'PUT',
    //   headers: {
    //     'x-auth-snailycad-token': Cookies.get('__session'),
    //   },
    //   data: {
    //     fullName: this.state.fullName,
    //     birth: this.state.birth,
    //     gender: this.state.gender,
    //     ethnicity: this.state.ethnicity,
    //     hairColor: this.state.hairColor,
    //     eyeColor: this.state.eyeColor,
    //     address: this.state.address,
    //     height: this.state.height,
    //     weight: this.state.weight,
    //   },
    // })
  };

  handleFileChange = (e) => {
    this.setState({
      image: e.target.files[0],
    });
  };

  render() {
    const {
      fullName,
      birth,
      ethnicity,
      gender,
      genders,
      ethnicities,
      error,
      hairColor,
      eyeColor,
      address,
      height,
      weight,
    } = this.state;
    return (
      <div className='container text-light'>
        {error ? <ErrorMessage message={error} /> : null}

        <form onSubmit={this.updateCitizen}>
          <div className='form-group'>
            <label htmlFor='fullName'>Select Image</label>
            <input
              type='file'
              onChange={this.handleFileChange}
              name='image'
              id='image'
              className='form-control'
            />
            <small>If none selected this will NOT overwrite your old one</small>
          </div>

          {/* Full Name */}
          <div className='form-group'>
            <label htmlFor='fullName'>Enter Full Name</label>
            <input
              disabled
              value={fullName}
              className='form-control bg-dark border-dark text-light'
              title='At this moment you are unable to change your name.'
            />
          </div>

          {/* Date of Birth */}
          <div className='form-group'>
            <label htmlFor='fullName'>Enter Date of Birth</label>
            <input
              value={birth}
              onChange={this.handleChange}
              name='birth'
              id='birth'
              className='form-control bg-dark border-dark text-light'
            />
          </div>

          {/* Ethnicity */}
          <div className='form-group'>
            <label htmlFor='fullName'>Enter Ethnicity</label>
            <select
              name='ethnicity'
              value={ethnicity}
              className='form-control bg-dark border-dark text-light'
              onChange={this.handleChange}>
              <option defaultChecked>{ethnicity}</option>
              <option disabled>--------</option>
              {ethnicities.map((ethnicity, index) => (
                <option key={index} value={ethnicity.name}>
                  {ethnicity.name}
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div className='form-group'>
            <label htmlFor='gender'>Enter Gender</label>
            <select
              name='gender'
              id='gender'
              className='form-control bg-dark border-dark text-light'
              value={gender}
              onChange={this.handleChange}>
              <option defaultChecked> {gender} </option>
              <option disabled>--------</option>

              {genders.map((gender, index) => (
                <option key={index} value={gender.name}>
                  {gender.name}
                </option>
              ))}
            </select>
          </div>

          {/* Hair Color */}
          <div className='form-group'>
            <label htmlFor='hairColor'>Enter Hair Color</label>
            <input
              value={hairColor}
              name='hairColor'
              id='hairColor'
              className='form-control bg-dark border-dark text-light'
              onChange={this.handleChange}
            />
          </div>

          {/* Eyes Color */}
          <div className='form-group'>
            <label htmlFor='eyeColor'>Enter Eye Color</label>
            <input
              value={eyeColor}
              name='eyeColor'
              id='eyeColor'
              className='form-control bg-dark border-dark text-light'
              onChange={this.handleChange}
            />
          </div>

          {/* Address */}
          <div className='form-group'>
            <label htmlFor='address'>Enter Address</label>
            <input
              value={address}
              name='address'
              id='address'
              className='form-control bg-dark border-dark text-light'
              onChange={this.handleChange}
            />
          </div>

          {/* Height */}
          <div className='form-group'>
            <label htmlFor='height'>Enter Height</label>
            <input
              value={height}
              name='height'
              id='height'
              className='form-control bg-dark border-dark text-light'
              onChange={this.handleChange}
            />
          </div>

          {/* Weight */}
          <div className='form-group'>
            <label htmlFor='weight'>Enter Weight</label>
            <input
              value={weight}
              name='weight'
              id='weight'
              className='form-control bg-dark border-dark text-light'
              onChange={this.handleChange}
            />
          </div>

          <div className='form-group float-right'>
            <a
              className='btn btn-danger mr-2'
              href={'/citizen/' + this.props.match.params.citizenId}>
              Cancel
            </a>
            <button className='btn btn-primary' type='submit'>
              Update Citizen
            </button>
          </div>
        </form>
      </div>
    );
  }
}
