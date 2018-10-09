const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.dataBaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.BAD_REQUEST = 'bad_request';
exports.validationError = message => internalError(message, exports.BAD_REQUEST);

exports.UNAUTHORIZED = 'unauthorized';
exports.unAuthorizedError = message => internalError(message, exports.UNAUTHORIZED);
