/* global exports, require */

'use strict';

var koast = require('koast');
var connection = koast.getDatabaseConnectionNow();
var mapper = koast.makeMongoMapper(connection);

exports.defaults = {};

exports.defaults.authorization = function defaultAuthorization(req, res) {
  // var authHeader = req.headers.authorization;
  // if (authHeader) {
  //   return authHeader[0] === '3';
  // } else {
  //   return false;
  // }
  return true;
};

// mapper.defaults.useEnvelope = false;

exports.routes = [
  {
    method: 'get',
    route: 'tasks',
    handler: mapper.get({
      model: 'tasks',
      useEnvelope: false
    })
  }
];