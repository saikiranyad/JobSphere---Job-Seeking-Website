import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { questionsByCategory } from "../utils/questions.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role, gender } = req.body;
    console.log(req.body)

    if (!fullname || !email || !phoneNumber || !password || !role || !gender) {
      return res.status(400).json({ message: "Something is missing", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email.", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Only upload profile photo if it is provided
    let profilePhotoUrl = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = cloudResponse.secure_url;
    }

    // Create the user without HR-specific fields during registration
    const newUser = new User({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      gender,
      profile: {
        profilePhoto: profilePhotoUrl, // profile photo is optional
      },
    });

    await newUser.save();

    return res.status(201).json({ message: "Account created successfully.", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Something is missing", success: false });
    }

    let user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password)) || role !== user.role) {
      return res.status(400).json({ message: "Incorrect email, password, or role.", success: false });
    }

    const token = jwt.sign({ userId: user._id }, "SAIKIRAN", { expiresIn: "1d" });

    return res.status(200).cookie("token", token, { maxAge: 86400000, httpOnly: true, sameSite: "strict" }).json({
      message: `Welcome back ${user.fullname}`,
      user,
      success: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, housetype, hno, street, city, area, district, pincode, fathername, aaddharnum, languages, bio, skills, dateofbirth, maritalstatus, category, companydetails, technologyworked, companyaddress, zone, companyIndustries, gst, pan, height, weight, Bloodgroup, Experiencelevel, directjob, trainingrequired, expectedsalary, negotiable, hrsatisfactory,
    } = req.body;

    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found.", success: false });
    }

    user.profile = user.profile || {};
    user.personaldetails = user.personaldetails || {};
    user.workhistory = user.workhistory || { natureofwork: {} };
    user.PhysicalDetails = user.PhysicalDetails || {};
    user.addressdetails = user.addressdetails || {};
    user.hrexe = user.hrexe || {};
    user.education = user.education || {}



    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (housetype) user.addressdetails.housetype = housetype;
    if (hno) user.addressdetails.hno = hno;
    if (street) user.addressdetails.street = street;
    if (area) user.addressdetails.area = area;
    if (city) user.addressdetails.city = city;
    if (district) user.addressdetails.district = district;
    if (pincode) user.addressdetails.pincode = pincode;
    // personal details

    if (fathername) user.personaldetails.fathername = fathername
    if (aaddharnum) user.personaldetails.aaddharnum = aaddharnum
    if (dateofbirth) user.personaldetails.dateofbirth = dateofbirth
    if (Experiencelevel) user.Experiencelevel = Experiencelevel
    if (languages) user.languages = languages;
    if (companydetails) user.workhistory.natureofwork.companydetails = companydetails;
    if (companyaddress) user.workhistory.natureofwork.companyaddress = companyaddress;
    if (technologyworked) user.workhistory.technologyworked = technologyworked;

    if (zone) user.workhistory.natureofwork.zone = zone;


    if (user.role === 'jobseeker') {
      // work history
      if (technologyworked) user.workhistory.technologyworked = technologyworked;
      if (companydetails) user.workhistory.natureofwork.companydetails = companydetails;
      if (companyaddress) user.workhistory.natureofwork.companyaddress = companyaddress;
      if (zone) user.workhistory.natureofwork.zone = zone;

      // physical details
      if (height) user.PhysicalDetails.height = height;
      if (weight) user.PhysicalDetails.weight = weight;
      if (Bloodgroup) user.PhysicalDetails.Bloodgroup = Bloodgroup;
      // Languages
      if (languages) user.languages = languages;
      if (Experiencelevel) user.Experiencelevel = Experiencelevel
      // hrexe

      if (directjob) user.hrexe.directjob = directjob
      if (trainingrequired) user.hrexe.trainingrequired = trainingrequired
      if (expectedsalary) user.hrexe.expectedsalary = expectedsalary
      if (negotiable) user.hrexe.negotiable = negotiable
      if (hrsatisfactory) user.hrexe.hrsatisfactory = hrsatisfactory


      if (req.body.education) {
        // Parse if education is a string (from FormData)
        let educationData = req.body.education;

        if (typeof educationData === 'string') {
          educationData = JSON.parse(educationData);
        }
        console.log(educationData)
        user.education = educationData
      }
    }

    // HR-specific fields
    if (user.role === "Hr" || user.role === "Employeer") {
      if (bio) user.profile.bio = bio;
      if (maritalstatus) user.profile.maritalstatus = maritalstatus;
      if (category) user.profile.category = category;
      if (gst) user.profile.gst = gst;
      if (pan) user.profile.pan = pan;
    }

    // Update skills only for jobseekers
    if (skills && user.role === "jobseeker") {
      user.profile.skills = skills.split(",");
    }

    // File upload for resume (if HR is uploading their resume)
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = req.file.originalname;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const submitAssessment = async (req, res) => {
  try {
    console.log("Received request body:", req.body)

    const { specialization, technical, questions } = req.body

    if (!specialization || !technical || !questions) {
      console.log("Missing required data")
      return res.status(400).json({
        message: "Missing required assessment data",
        success: false,
      })
    }

    const userId = req.id
    console.log("User ID:", userId)

    if (!userId) {
      console.log("No user ID found in request")
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      })
    }

    const user = await User.findById(userId)

    if (!user) {
      console.log("User not found for ID:", userId)
      return res.status(404).json({
        message: "User not found",
        success: false,
      })
    }

    user.skillAssessment = {
      specialization,
      technical,
      questions: {
        personal: questions["Personal / Psychology / Aptitude"].map((q, index) => ({
          question: questionsByCategory["Personal / Psychology / Aptitude"][index],
          rating: q.rating,
        })),
        technical: questions["Technical"].map((q, index) => ({
          question: questionsByCategory["Technical"][technical][index],
          rating: q.rating,
        })),
        professional: questions["Professional / Responsibility"].map((q, index) => ({
          question: questionsByCategory["Professional / Responsibility"][index],
          rating: q.rating,
        })),
      },
    }

    await user.save()

    console.log("Assessment saved successfully")
    return res.status(200).json({
      message: "Skill assessment submitted successfully",
      success: true,
    })
  } catch (error) {
    console.error("Error in submitAssessment:", error)
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    })
  }
}


export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)



    if (email === process.env.ADMINEMAIL && password === process.env.ADMINPASSWORD) {
      const token = jwt.sign({email}, process.env.JWT_SECRET, { expiresIn: "24d" });

      return res.status(200).cookie("token", token, { maxAge: 86400000, httpOnly: true, sameSite: "strict" }).json({
        message: `Welcome back Admin`,
         token,
        success: true
      });
    } else {
      console.log(err)
      return res.json({ success: false, message: 'error in Admin login api' })



    }






  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
