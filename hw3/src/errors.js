class httpErrors extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
      }
    
}

class badRequestError extends httpErrors{
    constructor(message) {
        super(400, message);
      }
}

class eternalServerError extends httpErrors{
    constructor(message) {
        super(500, message);
      }
}

module.exports = {
    badRequestError,
    eternalServerError
};