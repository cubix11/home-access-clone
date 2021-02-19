"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = void 0;
function checkUser(req, res, next) {
    const bearerToken = req.get('Authorization');
    console.log(bearerToken);
    next();
}
exports.checkUser = checkUser;
