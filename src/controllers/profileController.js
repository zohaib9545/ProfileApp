const { Profile, File } = require("../models/profileModel");
const { validEmail, hashPassword/*generateAccessToken*/,sendEmail,sendSms,generateOTP} = require("../utilities/vaildation");
const {generateToken}=require("../utilities/tokenGenerator")
require('dotenv').config();//import env
const bcrypt = require('bcrypt');
//create profile
const createProfile =async (req, res) => {
    try {
        const { firstName, lastName, email,phoneNumber,matriculationMarks,password,confirmPassword} = req.body;
        if (!req.body) {
            return res.status(400).json({
                code: 0,
                message: "No required data",
                data: {
                    message: "enter vaild data"
                }
            })
        }
        //password required
        if (!password) {
            return res.status(402).json({
                code: 0,
                message: "Password Required",
                data: { message: "Password must be required" }
            })
        }
        //email required
        if (!email) {
            return res.status(402).json({
                code: 0,
                message: "Email Required",
                data: { message: "Email must be required" }
            })
        }
        //confirm password required
        if (!confirmPassword) {
            return res.status(400).json({
                code: 0,
                message: "Confirm Password is required",
                data: {
                    message: "Confirm Password must be provided"
                }
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                code: 0,
                message: "Password and Confirm Password do not match",
                data: {
                    message: "Password and Confirm Password must be the same"
                }
            });
        }
        //check email pattern
        if (!validEmail(email)) {
            return res.status(402).json({
                code: 0,
                message: "invalid pattern",
                data: { message: "invalid email pattern" }
            })
        }

        //check first and last name validation
        if (typeof firstName !== "string" || typeof lastName !== "string") {
            return res.status(400).json({
                code: 0,
                message: "Invalid data",
                data: {
                    message: "Name must be a requied and be a number"
                }
            });
        }

        //genearte otp
        const otp = generateOTP();

        // Create a new profile document 
        const hashedPwd = await hashPassword(password);
        const profile = new Profile({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            matriculationMarks: matriculationMarks,
            password: hashedPwd,
            otp:otp
        });

        //check email aleardy exit or not
        const checkEmail = await Profile.findOne({ email });
        if (checkEmail) {
            return res.status(409).json({
                code: 0,
                message: "Email already exists",
                data: {
                    message: "Email address is already in use"
                }
            });
        }
        await profile.save();
        console.log(profile)

        //io.emit('newProfile', profile);
        //email send
        const emailSubject = "Welcome to Profile Project";
        const emailText = `Thank you for joining! Your OTP is: ${otp}`;
        sendEmail(email, emailSubject, emailText);

       //SMS send
     sendSms(phoneNumber, otp);
        return res.status(201).json({
            code: 1,
            message: "Profile created successfully",
            data: {
                profile: profile
            }
        });
    }

    catch (error) {
        console.error("Error", error);
        return res.status(500).json({
            code: 0,
            message: "Something went wrong",
            data: {
                message: "Something went wrong"
            }
        });
    }
};

//login profile
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!req.body) {
            return res.status(400).json({
                code: 0,
                message: "Invalid data",
                data: {
                    message: "Enter valid email and password"
                }
            });
        }

        const checkEmail = await Profile.findOne({ email });
        if (!checkEmail) {
            return res.status(404).json({
                code: 0,
                message: "Email not found",
                data: {
                    message: "Enter valid email"
                }
            });
        }

        const passwordMatch = await bcrypt.compare(password, checkEmail.password);

        if (!passwordMatch) {
            return res.status(401).json({
                code: 0,
                message: "Invalid password",
                data: {
                    message: "Enter valid password"
                }
            });
        }
        //Generate access token with agora
        const token =generateToken(email);
        return res.status(200).json({
              code: 1,
              message: "Login successful",
              data: {
                  token:token
              }
          });
        // Generate an access token
        // const accessToken = generateAccessToken(email);
        // console.log(accessToken)
        // return res.status(200).json({
        //     code: 1,
        //     message: "Login successful",
        //     data: {
        //         accessToken: accessToken
        //     }
        // });
        
    } catch (error) {
        console.error("Error", error);
        return res.status(500).json({
            code: 0,
            message: "Something went wrong",
            data: {
                message: "Something went wrong"
            }
        });
    }
};
// Logout function
const logout = async (req, res) => {
  try {
    const { email } = req.body;
    const checkEmail = await Profile.findOne({ email });
    if (!checkEmail) {
        return res.status(404).json({
            code: 0,
            message: "Email not found",
            data: {
                message: "Enter valid email"
            }
        });
    }
    return res.status(200).json({
      code: 1,
      message: "Logout successful",
      data: {
        message: "User has been successfully logged out",
      },
    });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({
      code: 0,
      message: "Something went wrong",
      data: {
        message: "Something went wrong",
      },
    });
  }
};

// Read profile data
const readData = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          code: 0,
          message: "Email and password are required",
          data: {
            message: "Please provide both email and password"
          }
        });
      }
      // Query the database to find a profile with the provided email
      const profile = await Profile.findOne({ email });
      if (!profile) {
        return res.status(404).json({
          code: 0,
          message: "Profile not found",
          data: {
            message: "No profile found with the provided email"
          }
        });
      }
      // Compare the hashed password
      const passwordMatch = await bcrypt.compare(password, profile.password);
      if (!passwordMatch) {
        return res.status(401).json({
          code: 0,
          message: "Invalid password",
          data: {
            message: "Incorrect password"
          }
        });
      }
      return res.status(200).json({
        code: 1,
        message: "Profile retrieved successfully",
        data: {
          profile: profile
        }
      });
    } catch (error) {
      console.error("Error", error);
      return res.status(500).json({
        code: 0,
        message: "Something went wrong",
        data: {
          message: "Something went wrong"
        }
      });
    }
  };

//change password
const changePassword = async (req, res) => {
    try {
      const { email, currentPassword, newPassword } = req.body;
  
      if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({
          code: 0,
          message: "Invalid data",
          data: {
            message: "Email, currentPassword, and newPassword are required"
          }
        });
      }
  
      // Query the database to find a profile with the provided email
      const profile = await Profile.findOne({ email });
  
      if (!profile) {
        return res.status(404).json({
          code: 0,
          message: "Profile not found",
          data: {
            message: "No profile found with the provided email"
          }
        });
      }
  
      // Compare the hashed current password
      const passwordMatch = await bcrypt.compare(currentPassword, profile.password);
  
      if (!passwordMatch) {
        return res.status(401).json({
          code: 0,
          message: "Invalid current password",
          data: {
            message: "Incorrect current password"
          }
        });
      }
  
      // Hash and save the new password
      const newHashedPassword = await hashPassword(newPassword);
      profile.password = newHashedPassword;
      await profile.save();
  
      return res.status(200).json({
        code: 1,
        message: "Password changed successfully",
        data: {
          message: "Password has been changed successfully"
        }
      });
    } catch (error) {
      console.error("Error", error);
      return res.status(500).json({
        code: 0,
        message: "Something went wrong",
        data: {
          message: "Something went wrong"
        }
      });
    }
  };
  //forget password
  const forgetPassword = async (req, res) => {
    try {
      const { email, matriculationMarks, newPassword } = req.body;
  
      if (!email || !matriculationMarks || !newPassword) {
        return res.status(400).json({
          code: 0,
          message: "Invalid data",
          data: {
            message: "Email, matriculationMarks, and newPassword are required",
          },
        });
      }
  
      // Query the database to find a profile with the provided email
      const profile = await Profile.findOne({ email });
  
      if (!profile) {
        return res.status(404).json({
          code: 0,
          message: "Profile not found",
          data: {
            message: "No profile found with the provided email",
          },
        });
      }
  
      // Check if the provided matriculation marks match the stored matriculation marks
      if (profile.matriculationMarks !== matriculationMarks) {
        return res.status(401).json({
          code: 0,
          message: "Invalid matriculation marks",
          data: {
            message: "Matriculation marks do not match the stored marks",
          },
        });
      }
  
      // Hash and save the new password
      const newHashedPassword = await hashPassword(newPassword);
      profile.password = newHashedPassword;
      await profile.save();
      //send message to email
      const emailSubject = "Forget Password";
      const emailText = "Your Password has been reset ";
        sendEmail(email, emailSubject, emailText);
        
      return res.status(200).json({
        code: 1,
        message: "Password changed successfully",
        data: {
          message: "Password has been changed successfully",
        },
      });
    } catch (error) {
      console.error("Error", error);
      return res.status(500).json({
        code: 0,
        message: "Something went wrong",
        data: {
          message: "Something went wrong",
        },
      });
    }
  };
  
// Delete profile
const deleteProfile = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                code: 0,
                message: "Invalid data",
                data: {
                    message: "Enter valid email and password"
                }
            });
        }

        // Check if the email exists in the database
        const checkEmail = await Profile.findOne({ email });
        if (!checkEmail) {
            return res.status(404).json({
                code: 0,
                message: "Email not found",
                data: {
                    message: "Enter valid email"
                }
            });
        }
        // Compare the hashed password
        const passwordMatch = await bcrypt.compare(password, checkEmail.password);
        if (!passwordMatch) {
            return res.status(401).json({
                code: 0,
                message: "Invalid password",
                data: {
                    message: "Enter valid password"
                }
            });
        }
        // Delete the profile
       const delProfile = await Profile.deleteOne({ email });
        if(delProfile)
        {
        return res.status(200).json({
            code: 1,
            message: "Profile deleted successfully",
            data: {
                message: "Profile deleted successfully"
            }
        });
    }
    } catch (error) {
        console.error("Error", error);
        return res.status(500).json({
            code: 0,
            message: "Something went wrong",
            data: {
                message: "Something went wrong"
            }
        });
    }
};
// multiple file uploaad
const multipleUploadFile = async (req, res) => {
  try {
    // Check if there are any files uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        code: 0,
        message: "No files uploaded",
        data: {
          message: "Please select one or more files to upload",
        },
      });
    }

    const uploadedFiles = req.files;
    const uploadedFileData = [];

    // Create new File documents for each uploaded file and save them to the database
    for (const uploadedFile of uploadedFiles) {
      const file = new File({
        originalName: uploadedFile.originalname,
        filename: uploadedFile.filename,
        size: uploadedFile.size,
        destination: uploadedFile.destination,
      });
      await file.save();
      uploadedFileData.push({
        originalName: uploadedFile.originalname,
        filename: uploadedFile.filename,
        size: uploadedFile.size,
        destination: uploadedFile.destination,
      });
    }

    return res.status(200).json({
      code: 1,
      message: "Files uploaded successfully",
      data: {
        files: uploadedFileData,
      },
    });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({
      code: 0,
      message: "Something went wrong",
      data: {
        message: "Something went wrong",
      },
    });
  }
};
//single file upload
const singleUploadFile = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        code: 0,
        message: "No file uploaded",
        data: {
          message: "Please select a file to upload",
        },
      });
    }

    const uploadedFile = req.file;

    // Create a new File document for the uploaded file and save it to the database
    const file = new File({
      originalName: uploadedFile.originalname,
      filename: uploadedFile.filename,
      size: uploadedFile.size,
      destination: uploadedFile.destination,
    });

    await file.save();

    return res.status(200).json({
      code: 1,
      message: "File uploaded successfully",
      data: {
        file: {
          originalName: uploadedFile.originalname,
          filename: uploadedFile.filename,
          size: uploadedFile.size,
          destination: uploadedFile.destination,
        },
      },
    });
  } catch (error) {
    console.error("Error", error);
    return res.status(500).json({
      code: 0,
      message: "Something went wrong",
      data: {
        message: "Something went wrong",
      },
    });
  }
};


module.exports = {
    createProfile,
    login,
    logout,
    readData,
    changePassword,
    forgetPassword,
    deleteProfile,
    singleUploadFile,
    multipleUploadFile,
};


