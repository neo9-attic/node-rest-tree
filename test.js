var assert = require('assert');

var rtree = require('./index');

function rbegin (req, res, next) { };
function rend   (req, res, next) { };
function uauth  (req, res, next) { };
function cstat  (req, res, next) { };
function cload  (req, res, next) { };
function cdirty (req, res, next) { };
function csave  (req, res, next) { };
function ccheck (req, res, next) { };
function cpost  (req, res, next) { };
function cput   (req, res, next) { };
function cget   (req, res, next) { };
function cdel   (req, res, next) { };
function epost  (req, res, next) { };
function elist  (req, res, next) { };

var tree = {
  $enter: rbegin,
  contacts: {
    $enter: cstat,
    $post: cpost,
    _: {
      $node: ':contactId',
      $enter: [ uauth, cload, ccheck ],
      $put: [ cput, cdirty ],
      $get: cget,
      $del: cdel,
      emails: {
        $post: [ epost, cdirty ],
        $get: elist
      },
      $leave: csave,
    }
  },
  $leave: rend
};

var routes = rtree.flatten(tree);

assert.deepEqual(
  routes,
  [
    {
      method: 'post',
      path: [ 'contacts' ],
      handlers: [
        rbegin,
        cstat,
        cpost,
        rend
      ]
    },
    {
      method: 'put',
      path: [ 'contacts', ':contactId' ],
      handlers: [
        rbegin,
        cstat,
        uauth,
        cload,
        ccheck,
        cput,
        cdirty,
        csave,
        rend
      ]
    },
    {
      method: 'get',
      path: [ 'contacts', ':contactId' ],
      handlers: [
        rbegin,
        cstat,
        uauth,
        cload,
        ccheck,
        cget,
        csave,
        rend
      ]
    },
    {
      method: 'del',
      path: [ 'contacts', ':contactId' ],
      handlers: [
        rbegin,
        cstat,
        uauth,
        cload,
        ccheck,
        cdel,
        csave,
        rend
      ]
    },
    {
      method: 'post',
      path: [ 'contacts', ':contactId', 'emails' ],
      handlers: [
        rbegin,
        cstat,
        uauth,
        cload,
        ccheck,
        epost,
        cdirty,
        csave,
        rend
      ]
    },
    {
      method: 'get',
      path: [ 'contacts', ':contactId', 'emails' ],
      handlers: [
        rbegin,
        cstat,
        uauth,
        cload,
        ccheck,
        elist,
        csave,
        rend
      ]
    }
  ]
);

