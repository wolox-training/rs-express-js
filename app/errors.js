const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);
exports.dataBaseError = message => internalError(message, exports.DEFAULT_ERROR);

exports.BAD_REQUEST = 'bad_request';
exports.validationError = message => internalError(message, exports.BAD_REQUEST);

exports.UNAUTHORIZED = 'unauthorized_error';
exports.unAuthorizedError = message => internalError(message, exports.UNAUTHORIZED);
