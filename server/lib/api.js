/* global exports, require */

'use strict';

var koast = require('koast');
var connection = koast.getDatabaseConnectionNow();
var mapper = koast.makeMongoMapper(connection);

exports.defaults = {};

function isOwner(data, req) {
  // return data.owner === 'alice';
  return true; //req.user && (data.owner === req.user.data.username);
}

function annotator(req, item, res) {
  item.meta.can = {
    edit : isOwner(item.data, req)
  };
}

exports.defaults.authorization = function defaultAuthorization(req, res) {
  // var authHeader = req.headers.authorization;
  // if (authHeader) {
  //   return authHeader[0] === '3';
  // } else {
  //   return false;
  // }
  return true;
};

mapper.options = {
  useEnvelope: true,
  queryDecorator: function() {},
  filter: function() { return true },
  annotator: function() {}
};

exports.routes = [
  {
    method: 'get',
    route: 'tasks',
    handler: mapper.get({
      model: 'tasks',
      useEnvelope: false
    })
  },
  {
    method: 'get',
    route: 'tasks-plus',
    handler: mapper.get({
      model: 'tasks',
      annotator: annotator
    })
  },
  {
    method: 'post',
    route: 'tasks-plus',
    handler: mapper.post({
      model: 'tasks',
      annotator: annotator
    })
  },
  {
    method: 'get',
    route: 'tasks-plus/:_id',
    handler: mapper.get({
      model: 'tasks',
      annotator: annotator
    })
  },
  {
    method: 'put',
    route: 'tasks-plus/:_id',
    handler: mapper.put({
      model: 'tasks',
      queryDecorator: function(query, req) {
        // query.owner = req.user.data.username;
      },
      annotator: annotator
    })
  }
];