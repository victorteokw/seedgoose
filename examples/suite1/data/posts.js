const map = require('lodash/map');
const times = require('lodash/times');
const flatten = require('lodash/flatten');
const faker = require('faker');

module.exports = flatten(map(["jack", "queen", "kay"], (a) => times(3, (i) => ({
  "_id": `${a} post ${i + 1}`,
  "author": a,
  "title": faker.random.word(),
  "content": faker.lorem.paragraphs()
}))));
