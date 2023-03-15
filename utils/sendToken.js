export const sendToken = (res, user, message, statusCode)=>{
    const token = user.getJwtToken();
    res.status(statusCode).json({
        success:true,
        message,
        user,
        token
        })
}