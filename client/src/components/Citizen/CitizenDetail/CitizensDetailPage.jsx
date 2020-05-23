import React, { Component } from 'react';
import axios from 'axios';
import { backendURL } from '../../../config/config';
import Cookies from 'js-cookie';
import GeneralInformation from './GeneralInformation';
import LicensesBox from "../Licenses/LicensesBox";
import LoadingArea from '../../Partials/LoadingArea';
import WeaponsBox from "../Weapons/WeaponsBox"
import MedicalRecordsBox from '../Medical/MedicalRecordsBox';
import RegisteredVehicles from "../Vehicles/RegisteredVehicles"


export default class CitizensDetailPage extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      picture: '',
      fullName: '',
      birth: '',
      gender: '',
      ethnicity: '',
      hairColor: '',
      eyeColor: '',
      address: '',
      height: '',
      weight: '',
      employer: '',
      ccw: '',
      dmv: '',
      pilotLicense: '',
      firearmsLicense: '',
    };
  }

  getCitizenData = () => {
    const citizenId = this.props.match.params.citizenId

    // main data
    axios({
      url: backendURL + '/citizen/' + citizenId,
      headers: {
        'x-auth-snailycad-token': Cookies.get('__session'),
      },
    })
      .then((res) => {
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

          // Update Title
          document.title = `Viewing: ${citizen.full_name}`;
        }

        this.setState({
          loading: false,
        });
      })
      .catch((err) => console.log(err));
  };


  componentDidMount() {
    this.getCitizenData();
  }

  render() {
    const {
      fullName,
      birth,
      gender,
      ethnicity,
      hairColor,
      eyeColor,
      address,
      height,
      weight,
      employer,
      loading,
      citizenId,
      picture,
      dmv,
      ccw,
      firearmsLicense,
      pilotLicense
    } = this.state;

    if (loading) {
      return <LoadingArea />;
    }

    return (
      <div className='container-fluid mt-2'>
        {/* Main Info Box */}
        <GeneralInformation
          fullName={fullName}
          birth={birth}
          gender={gender}
          ethnicity={ethnicity}
          hairColor={hairColor}
          eyeColor={eyeColor}
          address={address}
          height={height}
          weight={weight}
          employer={employer}
          id={citizenId}
          picture={picture}
        />

        <LicensesBox citizenId={citizenId} dmv={dmv} ccw={ccw} firearmsLicense={firearmsLicense} pilotLicense={pilotLicense} />

        {/* Medical Records */}
        <MedicalRecordsBox fullName={fullName} />

        {/* Weapons box */}
        <WeaponsBox />

        {/* Vehicles, Weapons, Ticket & Arrest reports */}
        <ul className="list-group">
          <RegisteredVehicles />
        </ul>
      </div>
    );
  }
}