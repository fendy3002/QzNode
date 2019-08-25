import * as myType from '../types';
const lang = function(context: myType.initContext): myType.lang {
    return {
        "auth": {
            "login": {
                "notMatch": "Username or password does not match."
            },
            "register": {
                "confirmError": "Password and confirmation does not match.",
                "exists": "User {username} or email {email} already exists.",
                "usernameFormat": "Username not in correct format.",
                "emailFormat": "Email not in correct format.",
                "success": "User has been successfully registered and an email confirmation has been sent. The user need to confirm the email first before login.",
                "successButEmailFail": "User has been successfully registered, but there are error when sending the confirmation email {err}.",
                "noConfirmationSuccess": "User has been successfully registered with password {password} . The password cannot be recovered by any means. Please change as soon as you able to.",
            },
            "changeEmail": {
                "emailFormatInvalid": "Email not in correct format.",
                "success": "Change email success.",
            },
            "changePassword": {
                "oldPasswordNotMatch": "Old password not match.",
                "confirmError": "New password and confirmation does not match."
            },
            "changeActive": {
                "success": "Change active success.",
            },
            "changeSuperAdmin": {
                "success": "Change super admin success."
            },
            "resendConfirmation": {
                "success": "Resend confirmation success."
            },
            "resetPassword": {
                "success": "User reset password success.",
                "noConfirmationSuccess": "User password has been reset to {password}.",
                "mailFailSend": "User password has been reset, but e-mail with new password is failed to be sent. Please try again later or contact your system administrator. {err}"
            },
            "setRole": {
                "success": "Set role success."
            },
            "general": {
                "notFound": "User not found.",
            }
        }
    };
};
export default lang;