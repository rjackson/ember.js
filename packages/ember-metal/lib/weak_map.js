import { assert } from 'ember-metal/debug';
import { GUID_KEY } from 'ember-metal/utils';
import {
  peekMeta,
  meta as metaFor
} from 'ember-metal/meta';

let id = 0;
function UNDEFINED() {}

/*
 * @private
 * @class Ember.WeakMap
 *
 * A partial polyfill for [WeakMap](http://www.ecma-international.org/ecma-262/6.0/#sec-weakmap-objects).
 *
 * There is a small but important caveat. This implementation assumes that the
 * weak map will live longer (in the sense of garbage collection) than all of its
 * keys, otherwise it is possible to leak the values stored in the weak map. In
 * practice, most use cases satisfy this limitation which is why it is included
 * in ember-metal.
 */
export default function WeakMap() {
  assert(
    'Invoking the WeakMap constructor with arguments is not supported at this time',
    arguments.length === 0
  );

  this._id = GUID_KEY + (id++);
}

/*
 * @method get
 * @param key {Object | Function}
 * @return {Any} stored value
 */
WeakMap.prototype.get = function(obj) {
  let meta = peekMeta(obj);
  if (meta) {
    let map = meta.readableWeak();
    if (map) {
      let value = map.get(this._id);
      if (value === UNDEFINED) {
        return undefined;
      }

      return value;
    }
  }
};

/*
 * @method set
 * @param key {Object | Function}
 * @param value {Any}
 * @return {WeakMap} the weak map
 */
WeakMap.prototype.set = function(obj, value) {
  assert(
    'Uncaught TypeError: Invalid value used as weak map key',
    obj && (typeof obj === 'object' || typeof obj === 'function')
  );

  if (value === undefined) {
    value = UNDEFINED;
  }

  metaFor(obj).writableWeak().set(this._id, value);

  return this;
};

/*
 * @method has
 * @param key {Object | Function}
 * @return {boolean} if the key exists
 */
WeakMap.prototype.has = function(obj) {
  let meta = peekMeta(obj);
  if (meta) {
    let map = meta.readableWeak();
    if (map) {
      return map.get(this._id) !== undefined;
    }
  }

  return false;
};

/*
 * @method delete
 * @param key {Object | Function}
 * @return {boolean} if the key was deleted
 */
WeakMap.prototype.delete = function(obj) {
  if (this.has(obj)) {
    metaFor(obj).writableWeak().delete(this._id);
    return true;
  } else {
    return false;
  }
};
