const FraudRadar = require("./FraudRadar");
const path = require("path");
const assert = require("assert");

describe("Fraud Radar", function () {
  it("Should process the one line file", function () {
    let result = FraudRadar.fileBasedCheck(
      path.join(__dirname, "Files", "OneLineFile.txt")
    );
    assert.ok(result);
    assert.equal(result.length, 0);
  });

  it("Should process the two line file in which the second is fraudulent", function () {
    let result = FraudRadar.fileBasedCheck(
      path.join(__dirname, "Files", "TwoLines_FraudulentSecond.txt")
    );
    assert.ok(result);
    assert.equal(result.length, 1);
    assert.equal(result[0].isFraudulent, true);
    assert.equal(result[0].orderId, 2);
  });

  it("Should process the three line file in which the second is fraudulent", function () {
    let result = FraudRadar.fileBasedCheck(
      path.join(__dirname, "Files", "ThreeLines_FraudulentSecond.txt")
    );
    assert.ok(result);
    assert.equal(result.length, 1);
    assert.equal(result[0].isFraudulent, true);
    assert.equal(result[0].orderId, 2);
  });

  it("Should process the four line file in which more than one order is fraudulent", function () {
    let result = FraudRadar.fileBasedCheck(
      path.join(__dirname, "Files", "FourLines_MoreThanOneFraudulent.txt")
    );
    assert.ok(result);
    assert.equal(result.length, 2);
  });

  // Array test

  it("Should process the one order array", function () {
    var orders = [
      [
        1,
        1,
        "bugs@bunny.com",
        "123 Sesame St.",
        "New York",
        "NY",
        10011,
        12345689010,
      ],
    ];
    let result = FraudRadar.arrayBasedCheck(orders);
    assert.ok(result);
    assert.equal(result.length, 0);
  });

  it("Should process the two orders array in which the second is fraudulent", function () {
    var orders = [
      [
        1,
        1,
        "bugs@bunny.com",
        "123 Sesame St.",
        "New York",
        "NY",
        10011,
        12345689010,
      ],
      [
        2,
        1,
        "bugs@bunny.com",
        "123 Sesame St.",
        "New York",
        "NY",
        10011,
        12345689011,
      ],
    ];
    let result = FraudRadar.arrayBasedCheck(orders);
    assert.ok(result);
    assert.equal(result.length, 1);
    assert.equal(result[0].isFraudulent, true);
    assert.equal(result[0].orderId, 2);
  });

  it("Should process the three line file in which the second is fraudulent", function () {
    var orders = [
      [
        1,
        1,
        "bugs@bunny.com",
        "123 Sesame St.",
        "New York",
        "NY",
        10011,
        12345689010,
      ],
      [
        2,
        1,
        "bugs@bunny.com",
        "123 Sesame St.",
        "New York",
        "NY",
        10011,
        12345689011,
      ],
      [
        3,
        2,
        "roger@rabbit.com",
        "1234 Not Sesame St.",
        "Colorado",
        "CL",
        10012,
        12345689012,
      ],
    ];
    let result = FraudRadar.arrayBasedCheck(orders);
    assert.ok(result);
    assert.equal(result.length, 1);
    assert.equal(result[0].isFraudulent, true);
    assert.equal(result[0].orderId, 2);
  });

  it("Should process the four orders array in which more than one order is fraudulent", function () {
    var orders = [
      [
        1,
        1,
        "bugs@bunny.com",
        "123 Sesame St.",
        "New York",
        "NY",
        10011,
        12345689010,
      ],
      [
        2,
        1,
        "bugs@bunny.com",
        "123 Sesame St.",
        "New York",
        "NY",
        10011,
        12345689011,
      ],
      [
        3,
        2,
        "roger@rabbit.com",
        "1234 Not Sesame St.",
        "Colorado",
        "CL",
        10012,
        12345689012,
      ],
      [
        4,
        2,
        "roger@rabbit.com",
        "1234 Not Sesame St.",
        "Colorado",
        "CL",
        10012,
        12345689014,
      ],
    ];
    let result = FraudRadar.arrayBasedCheck(orders);
    assert.ok(result);
    assert.equal(result.length, 2);
  });

  it("Should throw an error when something else than an Array is used on arrayBasedCheck", function () {
    assert.throws(function () {
      return FraudRadar.arrayBasedCheck(
        path.join(__dirname, "Files", "FourLines_MoreThanOneFraudulent.txt")
      );
    }, Error);
  });
});
