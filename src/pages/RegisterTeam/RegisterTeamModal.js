import React, {Component} from "react";
import Modal from "react-bootstrap/Modal";
import {TextField, Typography, FormLabel} from "@material-ui/core";
import {Button} from 'react-bootstrap';
import {Alert} from "@material-ui/lab";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusCircle, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {Row, Col} from "antd";

import "./RegisterTeamModal.css";

import {
  Enroll,
  User,
} from "../../api";
import LoadingScreen from "../Loading/LoadingScreen";
import { openNotification } from "../../shared-components/EDVNotification/EDVNotification";


class RegisterTeamModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamLeader: this.props.userInfo.fullname ,
      leaderRole: "Team Leader",
      teamMembers: [],
      teamMemberRequests: [],
      removedTeamMember: [],
      isClicked: false,
      isFetched: false,
      isLoading: false,
      inputAddTeamByEmail: "",
      isSubmitted: false,
      isCopied: false,
      errorMessage: "",
      enrollment: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getEnrolledUserList = this.getEnrolledUserList.bind(this);
  }

  async componentDidUpdate() {
    if (this.props.show && !this.state.isFetched) {
      const teamInformation = await this.getTeamInformation();
      await this.setState({
        teamMemberRequests: teamInformation.teamMember.map((member) => {
          return !member.isAccepted;
        }),
        enrollment: teamInformation,
        isFetched: true,
        isSubmitted: teamInformation.submitted,
        teamMembers:
          teamInformation !== undefined ? teamInformation.teamMember : [],
        // teamLeader:
        //   teamInformation !== undefined ? teamInformation.teamLeader : [], 
      });
    }
    if (this.props.userInfo.lastname !== null && this.props.userInfo.lastname !== ""){
      this.state.teamLeader = this.props.userInfo.firstname + " " + this.props.userInfo.lastname
    }
    else {
      this.state.teamLeader = this.props.userInfo.fullname
    }

  }
  async getEnrolledUserList(){
    const user = await User.getUserCall();
    const userList = user.data;
    const userArray = [];
    const userEmailList = [];
    if(userList.length > 0){
      userList.map((userlist, index) => {
        userArray[index] = userlist.enrolledEventID;
        userEmailList[index] = userlist.email;
      });
    }
    return userEmailList
  }

  getTeamInformation = async () => {
    const enrolledId = this.props.chosenEnrollment._id;

    return await Enroll.enrolledTeamInformationCall(enrolledId);
  };

  AddTeamMember() {
    let data = {
      id: "",
      name: "",
      role: "",
    };
    this.setState({
      teamMembers: [...this.state.teamMembers, data],
    });
  }
  changes(inputValue ){
    this.setState({
      inputAddTeamByEmail:inputValue
    })
  }

  handleChange(e) {
    const searchWrapper = document.querySelector(".search-input");
    const inputBox = searchWrapper.querySelector("input");
    const suggBox = searchWrapper.querySelector(".autocom-box")

    this.getEnrolledUserList().then(suggestions =>{
    inputBox.onkeyup = (e)=>{
      let userEnteredData = e.target.value;
      let emptyArray = [];
      if(userEnteredData){
        emptyArray = suggestions.filter((data)=>{
          return data.toLocaleLowerCase().startsWith(userEnteredData.toLocaleLowerCase());
        }); 
        emptyArray = emptyArray.map((data)=>{
          return data = `<li>${data}</li>`
        });

        searchWrapper.classList.add("active")
        showSuggestions(emptyArray)
        let allList = suggBox.querySelectorAll("li");

        for (let i = 0; i < allList.length; i++) {
          allList[i].addEventListener('click',  function() {
            document.getElementById("inputAddTeamByEmail").value = allList[i].textContent
            searchWrapper.classList.remove("active");
          });
        }
      }
      else{
        searchWrapper.classList.remove("active")
      }
    }
    if (document.getElementById("inputAddTeamByEmail")!=null){
      this.setState({
      inputAddTeamByEmail: document.getElementById("inputAddTeamByEmail").value
    })
  }
})

    function showSuggestions(list){
      let listData;
      if(!list.length){
          listData = `<li>No such email </li>`;
    }else if(list.length >=5){
      let maxlenght = 5
      let newArray = []
      for (var i =0; i<maxlenght;i++){
        newArray.push(list[i])
      }
      listData = newArray.join("")
    } 
    else{
        listData = list.join('');
    }
      suggBox.innerHTML = listData;
}

let target = e.target;
let value = target.type === "checkbox" ? target.checked : target.value;
let name = target.name;

this.setState({
  [name]: value,
});
  }

  handleChangeName(e, index) {
    let newArr = this.state.teamMembers.slice();
    newArr[index].name = e.target.value;
    this.setState({teamMembers: newArr});
  }

  handleChangeRole(e, index) {
    let newArr = this.state.teamMembers.slice();
    newArr[index].role = e.target.value;
    this.setState({teamMembers: newArr});
  }

  async handleSubmit() {
    if (!this.state.isClicked) {
      this.setState({ isClicked: true });
      const {removedTeamMember} = this.state;
      let eventId = this.props.event._id;
      let inviterId = this.props.userInfo._id;
      let leaderId = this.props.chosenEnrollment.participantID;
      let enrollmentId = this.props.chosenEnrollment._id;

      const teamInformationData = {
        eventId: eventId,
        inviterId: inviterId,
        leaderId: leaderId,
        enrollmentId: enrollmentId,
      };

      const inviterEmail = this.props.userInfo.email;
      const inviterName = this.props.userInfo.fullname;
      const organizerName = this.props.event.organizerName;
      const opportunityName = this.props.event.eventName;
      const isAccepted = false;

      const teamRequestData = {
        opportunityName: opportunityName,
        organizerName: organizerName,
        inviterName: inviterName,
        inviterEmail: inviterEmail,
      };

      const {teamMemberRequests} = this.state;
      let data = {
        teamLeader: this.state.teamLeader,
        teamMember: this.state.teamMembers,
        isTeamAdded: true,
      };

      let removedMemberIds = [];
      removedTeamMember.map((removedMember, i) => {
        removedMemberIds.push(removedMember.id);
      });

      if (removedTeamMember.length > 0) {
        await User.removeEnrolledEventFromUsers(
          removedMemberIds,
          eventId,
          enrollmentId,
        );
      }

      await Enroll.enrollEventAddTeamCall(data, enrollmentId);

      if (teamMemberRequests.length > 0) {
        await teamMemberRequests.map(async ( member, i) => {
          await Enroll.enrollEventUserRequestCall(
            teamInformationData,
            member.id,
            teamRequestData,
            isAccepted
          );
        });
        openNotification('success', 'Modifying team', 'Your changes on your team has been applied successfully');
        this.props.handleHide();
        this.setState({
          isFetched: false,
          isClicked: false,
          inputAddTeamByEmail: "",
          teamMembers: [],
        });
      } else {
        openNotification('success', 'Modifying team', 'Your changes on your team has been applied successfully');
        this.props.handleHide();
        this.setState({
          isFetched: false,
          isClicked: false,
          inputAddTeamByEmail: "",
          teamMembers: [],
        });
      }
    }
  }

  copyToClipBoard = async () => {
    let teamJoinLinkText = await document.getElementById("teamJoinLink");
    teamJoinLinkText.select();
    teamJoinLinkText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    this.setState({isCopied: true}, () => {
      setTimeout(() => {
        this.setState({isCopied: false})
      }, 10000)
    })
  };

  addTeamByEmail = async () => {
    const maximumTeamMembers = parseInt(process.env.REACT_APP_MAXIMUM_TEAM_MEMBERS);
    this.setState({
      errorMessage: "",
      inputAddTeamByEmail: "",
      isClicked: true
    });
    const inviterEmail = this.props.userInfo.email;
    const {
      inputAddTeamByEmail,
      teamMemberRequests,
      teamMembers,
      removedTeamMember,
    } = this.state;
    let userFound = "";

    if (inputAddTeamByEmail !== "") {
      if(inputAddTeamByEmail === inviterEmail){
        return this.setState({
          errorMessage: "You can not invite yourself. Please enter an email address registered with EDvengers",
          inputAddTeamByEmail: "",
          isClicked: false
        });
      }
      console.log('DEBUG: ', maximumTeamMembers);
        const totalTeamMembers = teamMembers.length;
      console.log('DEBUG: ', totalTeamMembers);
      if(totalTeamMembers === maximumTeamMembers) {
        return this.setState({
          errorMessage: "You have reached the maximum team members, can't invite more team members now",
          inputAddTeamByEmail: "",
          isClicked: false
        });
      }
      let alreadyInATeam = false;
      console.log(inputAddTeamByEmail)
      userFound = await User.findUserByEmail(inputAddTeamByEmail);

      if (userFound) {
        if (userFound.enrolledEventID.length > 0) {
          return userFound.enrolledEventID.forEach(async (enrollment) => {
            const enrolled = await Enroll.enrolledTeamInformationCall(enrollment.enrollmentId);
            if (enrolled) {
              if (enrolled.teamMember.length > 0) {
                if (enrolled.participantID === userFound._id) {
                  this.setState({
                    errorMessage: "You are inviting someone who is already a team leader in an existing team. If you want to join this person's team, please ask him or her to add you via email. For any other issues, please contact admin.",
                    inputAddTeamByEmail: "",
                    isClicked: false
                  });
                } else {
                  this.setState({
                    errorMessage: "This user has already been invited or already exists in your team.",
                    inputAddTeamByEmail: "",
                    isClicked: false
                  });
                }
              } else if (inputAddTeamByEmail === inviterEmail || alreadyInATeam) {
                this.setState({
                  errorMessage: "You cannot add a user that already exists in another team. Please contact the admin at hq@codefor.asia for custom support.",
                  inputAddTeamByEmail: "",
                  isClicked: false
                })
              }
              else if (!userFound.isParticipant) {
                this.setState({
                  errorMessage: "This user is not a participant",
                  inputAddTeamByEmail: "",
                  isClicked: false
                })
              } else {
                this.addNewTeamMember(removedTeamMember, userFound, teamMembers, teamMemberRequests);
                this.setState({
                  isClicked: false
                });
              }
            }
          })
        }
        this.setState({
          isClicked: false
        });
        return this.addNewTeamMember(removedTeamMember, userFound, teamMembers, teamMemberRequests);
      }

      this.setState({
        errorMessage: "The user does not currently exist in our system. Please ask him/her to register at https://climatehack.io/sign-up independently. After the user is done registering, the team leader should return here to add him/her via email again/send him/her this link to be added to your team.",
        inputAddTeamByEmail: "",
        isClicked: false
      });

      // if(findResult !== ""){
      //   alreadyInATeam = findResult.enrolledEventID.some(enrolled => {
      //     return enrolled['eventId'] === eventId && enrolled['isAccepted']
      //   })
      // }

    } else {
      return this.setState({
        errorMessage: "Please fill the email of the person you want to invite",
        inputAddTeamByEmail: "",
        isClicked: false
      });
    }
  };

  addNewTeamMember = (removedTeamMember, userFound, teamMembers, teamMemberRequests) => {
    let newRemovedTeamMember = [];
    const isExistInRemovedMember = removedTeamMember.find(
      (member) => member.id === userFound._id
    );
    if (isExistInRemovedMember) {
      removedTeamMember.map((removedMember, i) => {
        if (removedMember.id !== userFound._id) {
          newRemovedTeamMember.push(removedMember);
        }
      });
    }

    const isExistInTeam = teamMembers.find(
      (team) => team.id === userFound._id
    );
    const isExistInTeamRequest = teamMemberRequests.find(
      (team) => team.id === userFound._id
    );
    if (!isExistInTeam && !isExistInTeamRequest) {
      const userData = {
        id: userFound._id,
        name: userFound.fullname,
        role: "",
        isAccepted: false,
      };
      if (userFound.lastname !== null && userFound.lastname !== ""){
        userData.name = userFound.firstname + " " + userFound.lastname
      }
      this.setState({
        teamMembers: [...this.state.teamMembers, userData],
        teamMemberRequests: [...this.state.teamMemberRequests, userData],
        removedTeamMember: newRemovedTeamMember,
        errorMessage: "",
        inputAddTeamByEmail: "",
        isClicked: false
      });
    }
  }

  getShareLinkUrl = () => {
    const {chosenEnrollment, event} = this.props;
    let eventId = event._id;
    let enrolledId = chosenEnrollment ? chosenEnrollment._id : null;
    let leaderId = chosenEnrollment ? chosenEnrollment.participantID : null;
    let portalJoinTeamByUrl = "/jointeam/";
    let teamShareLink =
      window.location.host + portalJoinTeamByUrl + eventId + "-" + leaderId + "-" + enrolledId;
    return teamShareLink;
  };

  removeMember = async (teamMember, index) => {
    const {teamMembers, teamMemberRequests, removedTeamMember} = this.state;
    let newTeamMembers = [];
    let newTeamMemberRequests = [];
    // let removedTeamMember = removedTeamMember;

    teamMembers.map((member, i) => {
      if (member.id !== teamMember.id) {
        newTeamMembers.push(member);
      }
    });

    teamMemberRequests.map((member, i) => {
      if (member.id !== teamMember.id) {
        newTeamMemberRequests.push(member);
      }
    });

    removedTeamMember.push(teamMember);

    await this.setState({
      teamMembers: newTeamMembers,
      teamMemberRequests: newTeamMemberRequests,
      removedTeamMember: removedTeamMember,
    });
  };

  renderTeamField = (teamMember, isDisabled, index) => {
    return (
      <div key={index}>
        <Row style={{display: "flex", flexWrap: "wrap"}} key={index}>
          <Col xs={10} md={11}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              id="teamMember"
              name="teamMember"
              disabled
              value={teamMember.name}
              onChange={(e) => this.handleChangeName(e, index)}
              style={{width: "100%", paddingRight: "10px"}}
            />
          </Col>

          <Col xs={10} md={11}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              id="memberRole"
              name="memberRole"
              disabled={isDisabled}
              value={teamMember.role}
              onChange={(e) => this.handleChangeRole(e, index)}
              style={{width: "100%", paddingRight: "10px"}}
              placeholder="Member role"
            />
          </Col>

          <Col style={{display: "flex", alignItems: "center"}} xs={4} md={2}>
            {
              isDisabled ?
                <div/>
                :
                <FontAwesomeIcon
                  className="del-icon"
                  icon={faTrashAlt} size="lg"
                  style={{marginLeft: "10px"}}
                  onClick={(e) => {
                    this.removeMember(teamMember, index);
                  }}/>
            }
          </Col>
        </Row>
        <Row>
          {teamMember.isAccepted === false && (
            <div>
              <span style={{width: "10%", color: "red"}}>Pending Response</span>
            </div>
          )}
        </Row>
      </div>
    );
  };

  render() {
    const addTeamMemberButton = (
      <div align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => this.AddTeamMember(e)}
        >
          <Typography>
            <FontAwesomeIcon icon={faPlusCircle} size="sm"/>
            Add New Team Member
          </Typography>
        </Button>
      </div>
    );

    let {isSubmitted} = this.state;
    const isTeamLeader = this.props.userInfo._id === this.state.enrollment.participantID;

    return (
      <Modal
        {...this.props}
        className="edit-team"
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={this.props.show}
        onHide={() => {
          this.props.handleHide();
          this.setState({
            isFetched: false,
            inputAddTeamByEmail: "",
            teamMembers: [],
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {isSubmitted ? 'View Team' : 'Edit Team'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          {(this.state.isClicked || !this.state.isFetched) && (<LoadingScreen/>)}
          {!this.state.isClicked && (
            <>
              <FormLabel><h5>Team Leader</h5></FormLabel><br/>
              <FormLabel>Team Leader Name</FormLabel>
              <form className="FormFields" onSubmit={this.handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="teamLeader"
                  name="teamLeader"
                  value={this.state.teamLeader}
                  autoFocus
                  disabled
                />
                <FormLabel style={{marginTop: "10px"}}><h5>Team Members</h5></FormLabel><br/>
                {(this.state.teamMembers.length === 0) ?
                <p><i>No team members added yet</i></p>
                : this.state.teamMembers.map((teamMember, index) => {
                  const isAccepted = teamMember.isAccepted === true;
                  return this.renderTeamField(teamMember, isSubmitted || isTeamLeader && isAccepted || !isTeamLeader, index);
                })}

                <hr/>
                <Row>
                  <Row>
                    {
                      this.state.errorMessage && (
                        <Alert icon={false} severity="error">
                          {this.state.errorMessage}
                        </Alert>
                      )
                    }
                  </Row>
                  <FormLabel><h5>Add a Team Member</h5></FormLabel><br/>
                  <Row>
                    <p><i>
                      Invite your friends using the email registered with EDvengers
                    </i></p>
                  </Row>
                  <Row style={{display: "flex", flexWrap: "wrap"}} gutter={16}>
                    <Col xs={24} lg={18}>
                      <div class="search-input">
                      <input
                        variant="outlined"
                        margin="normal"
                        id="inputAddTeamByEmail"
                        name="inputAddTeamByEmail"
                        placeholder="Email"
                        onChange={(e) => this.handleChange(e)}
                        value={this.state.inputAddTeamByEmail}
                        disabled={isSubmitted || !isTeamLeader}
                        style={{width: '100%'}}
                      />
                       <div class="autocom-box">
                         <li>Email-1</li>
                         <li>Email-2</li>
                         <li>Email-3</li>
                         <li>Email-4</li>
                         <li>Email-5</li>
                       </div>
                      </div>
                    </Col>
                    <Col style={{display: "flex", alignItems: "center"}} xs={24} lg={6}>
                      <Button
                        onClick={this.addTeamByEmail}
                        variant="blue"
                        disabled={isSubmitted || !isTeamLeader}
                        style={{width: "100%"}}
                      >
                        Add member
                      </Button>
                    </Col>
                  </Row>

                  {/*<FormLabel>Join Team Share Link</FormLabel>*/}
                  {/*<p><i>Copy this link to invite your friends</i></p>*/}
                  {/*<Row style={{display: "flex", flexWrap: "wrap"}} gutter={16}>*/}
                    {/*<Col xs={24} lg={18}>*/}
                      {/*<TextField*/}
                        {/*variant="outlined"*/}
                        {/*margin="normal"*/}
                        {/*id="teamJoinLink"*/}
                        {/*className="FormField"*/}
                        {/*name="memberRole"*/}
                        {/*style={{width: "100%"}}*/}
                        {/*value={this.getShareLinkUrl()}*/}
                        {/*disabled={isSubmitted || isTeamLeader}*/}
                      {/*/>*/}
                    {/*</Col>*/}
                    {/*<Col style={{display: "flex", alignItems: "center"}} xs={24} lg={6}>*/}
                      {/*<Button*/}
                        {/*onClick={this.copyToClipBoard}*/}
                        {/*variant="blue"*/}
                        {/*style={{width: "100%"}}*/}
                        {/*disabled={isSubmitted || isTeamLeader}*/}
                      {/*>*/}
                        {/*{this.state.isCopied ? 'Copied' : 'Share Link'}*/}
                      {/*</Button>*/}
                    {/*</Col>*/}
                  {/*</Row>*/}
                </Row>
                
                <Row type = "flex" style={{alignItems: 'center'}} justify='center'>
                <p style = {{color: 'red'}}><i>Important: Please click the Save button after adding your team members</i></p>
                </Row>
                <Row
                  type="flex"
                  style={{alignItems: 'center'}}
                  justify="center">
                  <Col>
                    <Button
                      onClick={() => {
                        this.props.handleHide();
                        this.setState({
                          isFetched: false,
                          inputAddTeamByEmail: "",
                          teamMembers: [],
                        });
                      }}
                      variant="blue"
                    >
                      Cancel
                    </Button>

                    <Button
                      onClick={async () => {
                        await this.handleSubmit()
                      }}
                      variant="red"
                      disabled={isSubmitted || !isTeamLeader}
                    >
                      Save
                    </Button>
                  </Col>
                </Row>
              </form>
            </>
          )}
        </Modal.Body>
      </Modal>
    );
  }
}

export default RegisterTeamModal;
