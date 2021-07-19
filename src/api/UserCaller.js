// This is the api caller to call the route with axios
import axios from "axios";
import header from "./secret";
import { MASTER_DATA_BASE_URL } from "./Constant";
import {consoleHelper} from "../util";

const helloCall = async () => {
  return await axios
    .get(MASTER_DATA_BASE_URL + "/api/user/hello")
    .then((res) => {
      const data = res.data.text;
      return data;
    })
    .catch((err) => {
      consoleHelper(err);
      return null;
    });
};

const getorgID = async (id) => {
  consoleHelper("hello : " + id);
  return await axios
    .post(MASTER_DATA_BASE_URL + "/api/user/organizerid", { userId: id })
    .then((res) => {
      const data = res.data;
      return data;
    })
    .catch((err) => {
      consoleHelper(err);
      return null;
    });
};

const getUserName = async (id) => {
  consoleHelper(id);
  return await axios
    .post(MASTER_DATA_BASE_URL + "/api/user/getuserName", { userID: id })
    .then((res) => {
      const data = res.data;
      return data;
    })
    .catch((err) => {
      consoleHelper(err);
      return null;
    });
};

const getUserCall = async () =>{
  let axiosConfig = {
    headers: {
      Authorization: header,
    },
  };
  return await axios
    .get(MASTER_DATA_BASE_URL + "/api/user/getuser",axiosConfig)
    .then((res) => {
      const data = res.data;
      return data;
    })
    .catch((err) => {
      consoleHelper(err);
      return null;
    });
};

const signupCall = async (userinfo) => {
  // Call axios signup api
  let axiosConfig = {
    headers: {
      Authorization: header,
    },
  };

  return await axios
    .post(MASTER_DATA_BASE_URL + "/api/user/signup", userinfo, axiosConfig)
    .then((res) => {
      const data = res.data;
      return data;
    })
    .catch((err) => {
      consoleHelper(err);
      return null;
    });
};

const updateCall = async (userInfo) => {
  let axiosConfig = {
    headers: {
      Authorization: header,
    },
  };
  
  return await axios 
  .post(MASTER_DATA_BASE_URL + `/api/user/editprofile`, userInfo, axiosConfig)
    .then((res) => {
      const data = res.data;
      return data;
    })
    .catch((err) => {
      consoleHelper(err);
      return null;
    });
};

const loginCall = async (userinfo) => {
  //Call axios login api
  let axiosConfig = {
    headers: {
      Authorization: header,
    },
  };

  return await axios
    .post(MASTER_DATA_BASE_URL + "/api/user/login", userinfo, axiosConfig)
    .then((res) => {
      consoleHelper(res);
      const data = res.data;
      return data;
    })
    .catch((err) => {
      consoleHelper(err);
      return null;
    });
};

const isLoggedInCall = async () => {
  const jwtToken = await localStorage.getItem("JWT");

  let axiosConfig = {
    headers: {
      Authorization: `JWT ${jwtToken}`,
    },
  };

  return await axios
    .get(MASTER_DATA_BASE_URL + "/api/user/isloggedin", axiosConfig)
    .then((res) => {
      consoleHelper(res);
      const data = res.data;
      return data;
    })
    .catch((err) => {
      consoleHelper(err);
      return null;
    });
};

const findUserByEmail = async (email) => {
  consoleHelper("Find User Email");
  let axiosConfig = {
    headers: {
      Authorization: header,
    },
  };

  let data = {
    email: email,
  };
  consoleHelper(data);
  return await axios
    .post(MASTER_DATA_BASE_URL + "/api/user/finduseremail", data, axiosConfig)
    .then((res) => {
      const data = res.data;
      consoleHelper(data);
      return data;
    })
    .catch((err) => {
      consoleHelper(err);
      return null;
    });
};

const removeEnrolledEventFromUsers = async (userIds, eventId, enrolledId) => {
  consoleHelper("Remove Enrolled Event from Users");
  let axiosConfig = {
    headers: {
      Authorization: header,
    },
  };

  let data = {
    userIds: userIds,
    eventId: eventId,
    enrolledId: enrolledId,
  };
  consoleHelper(data);

  return await axios
    .post(
      MASTER_DATA_BASE_URL + "/api/user/remove-enrolled-event",
      data,
      axiosConfig
    )
    .then((res) => {
      const data = res.data;
      consoleHelper(data);
      return data;
    })
    .catch((err) => {
      consoleHelper(err);
      return null;
    });
};

const getNotificationBasedOnId = async (userId) => {
  let axiosConfig = {
    headers: {
      Authorization: header,
    },
  };

  return await axios
    .post(
      MASTER_DATA_BASE_URL + "/api/user/getnotificationsbasedonid",
      { userId },
      axiosConfig
    )
    .then((res) => {
      const data = res.data;
      consoleHelper(data);
      return data;
    })
    .catch((err) => {
      consoleHelper(err);
      consoleHelper("Likely an incorrect ID provided...");
      return null;
    });
};

const getFormsBasedOnOrganizerId = async (userId) => {
  let axiosConfig = {
    headers: {
      Authorization: header,
    },
  };

  return await axios
    .post(
      MASTER_DATA_BASE_URL + "/api/user/findUserForms",
      { userId },
      axiosConfig
    )
    .then((res) => {
      const data = res.data;
      consoleHelper(data);

      return data;
    })
    .catch((err) => {
      consoleHelper(err);
      consoleHelper("Likely an incorrect ID provided...");
      return null;
    });
};

const findReviewers = async () => {
  return await axios
    .get(MASTER_DATA_BASE_URL + "/api/user/findreviewers")
    .then((res) => {
      const data = res.data;
      consoleHelper(data);
      return data;
    })
    .catch((err) => {
      consoleHelper(err);
      consoleHelper("Error occured fetching list of reviewers!");
      return null;
    });
};

const addSubmissionForReview = async (usersId, submissionId) => {
  let axiosConfig = {
    headers: {
      Authorization: header,
    },
  };

  return await axios
    .post(
      MASTER_DATA_BASE_URL + "/api/user/addsubmissionforreview",
      { usersId: usersId, submissionId: submissionId },
      axiosConfig
    )
    .then((res) => {
      const data = res.data;
      consoleHelper(data);
      return data;
    })
    .catch((err) => {
      consoleHelper(err);
      consoleHelper("Likely an incorrect ID provided...");
      return null;
    });
};

const removeSubmissionForReview = async (usersId, submissionId) => {
  let axiosConfig = {
    headers: {
      Authorization: header,
    },
  };

  return await axios
    .post(
      MASTER_DATA_BASE_URL + "/api/user/removesubmissionforreview",
      { usersId: usersId, submissionId: submissionId },
      axiosConfig
    )
    .then((res) => {
      const data = res.data;
      consoleHelper(data);
      return data;
    })
    .catch((err) => {
      consoleHelper(err);
      consoleHelper("Likely an incorrect ID provided...");
      return null;
    });
};

const deactivateFormNotification = async (userId, formId) => {
  let axiosConfig = {
    headers: {
      Authorization: header,
    },
  };

  return await axios
    .post(
      MASTER_DATA_BASE_URL + "/api/user/deactivate-form-notification",
      {userId, formId},
      axiosConfig
    )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return null;
    })
}

const resetPassword = async (email) => {
  let axiosConfig = {
    headers: {
      Authorization: header,
    }
  }

  return await axios
    .post(
      MASTER_DATA_BASE_URL + "/api/user/reset-password",
      {email},
      axiosConfig
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      if(err.response) return err.response.data;
      return null;
    })

}

const checkResetPasswordToken = async (token) => {
  let axiosConfig = {
    headers: {
      Authorization: header,
    },
  }

  return await axios
    .get(MASTER_DATA_BASE_URL + `/api/user/check-reset-password-token/${token}`, axiosConfig)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      if(err.response) return err.response.data;
      return null;
    })
}

const updatePasswordViaEmail = async (email,password) => {
  let axiosConfig = {
    headers: {
      Authorization: header,
    }
  }

  const body = {
    email,
    password
  }

  return await axios
    .post(
      MASTER_DATA_BASE_URL + '/api/user/update-password-via-email',
      body,
      axiosConfig)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return null;
    })
}

export default {
  helloCall,
  getorgID,
  signupCall,
  loginCall,
  getUserCall,
  getUserName,
  isLoggedInCall,
  findUserByEmail,
  removeEnrolledEventFromUsers,
  getFormsBasedOnOrganizerId,
  getNotificationBasedOnId,
  findReviewers,
  addSubmissionForReview,
  removeSubmissionForReview,
  deactivateFormNotification,
  resetPassword,
  checkResetPasswordToken,
  updatePasswordViaEmail,
  updateCall,
};

