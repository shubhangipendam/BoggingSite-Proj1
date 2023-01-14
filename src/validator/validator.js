const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
}
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false;
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidName = function (abc) {
    if (typeof abc === 'undefined' || abc === null) return false;
    if (typeof abc === 'string' && abc.trim().length === 0) return false
    const regex = /^[a-zA-Z]{3,13}$/;
    return regex.test(String(abc));
}

const isValidpassword = function (abc) {
    if (typeof abc === 'undefined' || abc === null) return false;
    if (typeof abc === 'string' && abc.trim().length === 0) return false
    const regex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return regex.test(String(abc));
}


function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = { isValid, isValidEmail, isValidRequestBody, isValidName,isValidpassword }
