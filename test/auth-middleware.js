const authMiddleware = require("../middleware/is-auth");
const expect = require("chai").expect;

it("should throw error when no authorization in header", function () {
  const req = {
    get: function (headerName) {
      return null;
    },
  };

  expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
    "Not Authentication"
  );
});
