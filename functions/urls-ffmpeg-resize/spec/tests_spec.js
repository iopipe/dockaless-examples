var mylambda = require('../index.js')
var url = require('url')

describe("resizing url", () => {
  it("gives me a url", (done) => {
    mylambda({
      urls: [
        "https://whatever.iopipe.com"
      ]
    }, (e) => {
      var u = url.parse(e)
      expect(u.protocol).toBe("http:");
      done();
    })
  }, 300)
})
