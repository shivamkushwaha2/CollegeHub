const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
    // Log the headers to see if the Authorization header is being passed
    // console.log("Authorization Header:", req.headers.authorization);

    // Get the token from the 'Authorization' header
    const token = req.headers.authorization?.split(" ")[1]; 

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decodedData = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decodedData?.id; // Attach userId to the request
        // console.log("Decoded User ID:", req.userId);
        next();
    } catch (error) {
        console.log("Token verification failed:", error);
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
};



module.exports = authMiddleware;

// const auth = (req,res,next)=>{
//     try {

//     let token = req.headers.authorization;
//     if(token)
//     {
//         token = token.split(" ")[1];
//         let user = jwt.verify(token,SECRET_KEY);
//         req.userId = user.id;
//     }
//     else
//     {
//         return res.status(401).json({message:"Unauthorized User"});
//     }

//     next();

//     } catch (error) {
//         console.log(error);
//         res.status(401).json({message:"Unauthorized User"});

//     } 
// }
// module.exports = auth;