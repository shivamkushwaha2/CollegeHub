const ProfileModel = require("../models/profileModel");

const updateProfile = async (req,res)=>{ 

    try {
        const {name,email,profession,bio,educationalBackground,skills,experience} = req.body;

        const profile = new ProfileModel({
            name,
            email,
            profession,   
            bio,
            educationalBackground,
            skills,
            experience
        });

        await profile.save();
        res.status(200).json({ message: "Profile updated successfully", profile });

    } catch (error) {
        console.log("Profile update ERROR: ", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }

};

const getProfile = async (req,res)=>{
    const email = req.query.email.trim();
    try {
        const profile = await ProfileModel.findOne({email:email});
        if(profile){
            res.status(200).json(profile);

        }else{
            res.status(404).json({message:"Profile not found, Please Update"});
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

module.exports = {updateProfile,getProfile};