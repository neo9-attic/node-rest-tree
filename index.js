module.exports.flatten = function (tree) {
  var routes = [];

  var wrap = function (x) {
    return x instanceof Array ? x : [ x ];
  };

  var sorter = function (a, b) {
    return b === '_' ? -1 : 1;
  };

  var _flatten = function (path, enter, leave, tree) {
    if (tree.$enter) enter = enter.concat(wrap(tree.$enter));
    if (tree.$leave) leave = wrap(tree.$leave).concat(leave);

    Object.getOwnPropertyNames(tree).sort(sorter).forEach(function (key) {
      var value = tree[key];
      switch (key) {
        case '$node':
        case '$enter':
        case '$leave': {
        } break;

        case '$post':
        case '$put':
        case '$get':
        case '$del': {
          var method = key.slice(1);
          routes.push({
            method: method,
            path: path,
            handlers: enter.concat(wrap(value), leave)
          });
        } break;

        default: {
          var dir = value.$node || key;
          var subpath = path.concat(wrap(dir));
          _flatten(subpath, enter, leave, value);
        } break;
      }
    });
  };

  _flatten([], [], [], tree);

  return routes;
};

