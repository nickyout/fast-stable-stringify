/**
 * Returns the element within obj under the path given by pathSegments.
 * If any segment does not yet exist, an object is created on that place.
 * @param {Object} obj
 * @param {string[]} pathSegments
 * @param {boolean} [appendIfMissing=false]
 * @returns {Object}
 */
module.exports = function getPath(obj, pathSegments, appendIfMissing) {
	var target = obj;
	var pathSeg;
	var i;
	for (i = 0; i < pathSegments.length; i++) {
		pathSeg = pathSegments[i];
		if (!target.hasOwnProperty(pathSeg)) {
			if (appendIfMissing) {
				target[pathSeg] = {};
			} else {
				return null;
			}
		}
		target = target[pathSeg];
	}
	return target;
};