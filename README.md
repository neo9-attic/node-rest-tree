Rest Tree
=========

So far the library simply allow to generate flattened RESTful routes from a
tree-oriented description of end-points.

Install
-------

    npm install rest-tree

Usage
-----

    var rmount = require('rest-mount');
    var rtree = require('rest-tree');

    var routes = rtree.flatten({
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
    });

    rmount.mount(routes, http, '/service');

will produce these end-points

    POST /contacts                   [ rbegin, cstat, cpost, rend ]
    PUT  /contacts/:contactId        [ rbegin, cstat, uauth, cload, ccheck, cput, cdirty, csave, rend ]
    GET  /contacts/:contactId        [ rbegin, cstat, uauth, cload, ccheck, cget, csave, rend ]
    DEL  /contacts/:contactId        [ rbegin, cstat, uauth, cload, ccheck, cdel, csave, rend ]
    POST /contacts/:contactId/emails [ rbegin, cstat, uauth, cload, ccheck, epost, cdirty, csave, rend ]
    GET  /contacts/:contactId/emails [ rbegin, cstat, uauth, cload, ccheck, elist, csave, rend ]

