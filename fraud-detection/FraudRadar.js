const fs = require("fs");

function fileBasedCheck(filePath) {
  let orders = [];
  let fileContent = fs.readFileSync(filePath, "utf8");
  let lines = fileContent.split("\n");
  for (let line of lines) {
    let items = line.split(",");
    let order = {
      orderId: Number(items[0]),
      dealId: Number(items[1]),
      email: items[2].toLowerCase(),
      street: items[3].toLowerCase(),
      city: items[4].toLowerCase(),
      state: items[5].toLowerCase(),
      zipCode: items[6],
      creditCard: items[7],
    };
    orders.push(order);
  }
  return Check(orders);
}

function arrayBasedCheck(orders) {
  if (Array.isArray(orders)) {
    let ordersToBeChecked = [];
    for (let order of orders) {
      let orderToObject = {
        orderId: Number(order[0]),
        dealId: Number(order[1]),
        email: order[2].toLowerCase(),
        street: order[3].toLowerCase(),
        city: order[4].toLowerCase(),
        state: order[5].toLowerCase(),
        zipCode: order[6],
        creditCard: order[7],
      };
      ordersToBeChecked.push(orderToObject);
    }
    return Check(ordersToBeChecked);
  } else {
    throw new Error("Orders should be an array.");
  }
}

function Check(orders) {
  // NORMALIZE
  normalize(orders);

  // CHECK FRAUD
  return checkFraud(orders);
}

function checkFraud(orders) {
  let fraudResults = [];
  for (let i = 0; i < orders.length; i++) {
    let current = orders[i];
    let isFraudulent = false;

    for (let j = i + 1; j < orders.length; j++) {
      isFraudulent = false;
      if (
        current.dealId === orders[j].dealId &&
        current.email === orders[j].email &&
        current.creditCard !== orders[j].creditCard
      ) {
        isFraudulent = true;
      }

      if (
        current.dealId === orders[j].dealId &&
        current.state === orders[j].state &&
        current.zipCode === orders[j].zipCode &&
        current.street === orders[j].street &&
        current.city === orders[j].city &&
        current.creditCard !== orders[j].creditCard
      ) {
        isFraudulent = true;
      }

      if (isFraudulent) {
        fraudResults.push({
          isFraudulent: true,
          orderId: orders[j].orderId,
        });
      }
    }
  }
  return fraudResults;
}

/**
 *
 * @function normalize
 *
 * @param {Array<order>} orders - List of orders.
 */
function normalize(orders) {
  let streetAbbreviations = [
    ["st.", "street"],
    ["rd.", "road"],
  ];
  let stateAbbreviations = [
    ["il", "illinois"],
    ["ca", "california"],
    ["ny", "new york"],
  ];
  for (const order of orders) {
    let aux = order.email.split("@");
    let atIndex = aux[0].indexOf("+");
    aux[0] =
      atIndex < 0
        ? aux[0].replace(".", "")
        : aux[0].replace(".", "").substring(0, atIndex - 1);
    order.email = aux.join("@");

    // Normalize street
    order.street = replaceAbbreviations(streetAbbreviations, order.street);
    // Normalize state
    order.state = replaceAbbreviations(stateAbbreviations, order.state);
  }
}

/**
 *
 *
 * @param {Array} abbreviationDictionary
 * @param {object} objectToParse - Object with abbreviations that are going to be replaced.
 * @returns {object} Parsed object
 */
function replaceAbbreviations(abbreviationDictionary, objectToParse) {
  for (let i = 0; i < abbreviationDictionary.length; i++) {
    objectToParse.replace(
      abbreviationDictionary[i][0],
      abbreviationDictionary[i][1]
    );
  }
  return objectToParse;
}

module.exports = { fileBasedCheck, arrayBasedCheck };
