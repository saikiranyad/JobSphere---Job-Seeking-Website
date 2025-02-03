import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phoneNumber: {
            type: Number,
        },
        password: {
            type: String,
            required: true,
        },  
        gender: {
            type: String,
            enum:['male','female']
        },
        role: {
            type: String,
            enum: ["jobseeker", "Employeer", "Hr","admin"],
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verifyOTP: {
            type: String,
        },
        otpExpiry: {
            type: Date,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpiry: {
            type: Date,
        },
        addressdetails: {
            housetype: String,
            hno: String,
            street: String,
            area: String,
            city: String,
            district: String,
            pincode: String,
        },
        personaldetails: {
            fathername: String,
            aaddharnum: { type: Number, default: 0 },
            dateofbirth: Date,
        },
        PhysicalDetails: {
            height: String,
            weight: String,
            Bloodgroup: String,
        },
        Experiencelevel: String,
        workhistory: {
            technologyworked: String,
            natureofwork: {
                companydetails: String,
                companyaddress: String,
                zone: String,
            },
        },
        languages: String,
        hrexe: {
            directjob: String,
            trainingrequired: String,
            expectedsalary: String,
            negotiable: String,
            hrsatisfactory: String,
        },
        education: [
            {
                instituionname: { type: String, required: true },
                degree: { type: String, required: true },
                fieldOfStudy: { type: String, required: true },
                startDate: Date,
                endDate: Date,
                grade: String,
            }
        ],
        profile: {
            bio: String,
            skills: [String],
            resume: String,
            dateofbirth: Date,
            maritalstatus: String,
            category: String,
            companyIndustries: String,
            gst: String,
            pan: String,
            profilePhoto: { type: String, default: "" },
        },
        skillAssessment: {
            specialization: String,
            technical: String,
            questions: {
                personal: [
                    {
                        question: String,
                        rating: { type: Number, min: 0, max: 10 },
                    },
                ],
                technical: [
                    {
                        question: String,
                        rating: { type: Number, min: 0, max: 10 },
                    },
                ],
                professional: [
                    {
                        question: String,
                        rating: { type: Number, min: 0, max: 10 },
                    },
                ],
            },
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);