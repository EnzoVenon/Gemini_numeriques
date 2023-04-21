/**
 * add edge line to three js object
 * @param {Object} mesh - 3D oject three js 
 * @param {String} colorEdge - color of the edge
 * @param {Object} THREE - three js lib
 */
export function addEdgeObj3d(mesh, colorEdge, THREE) {
    var objectEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry),
        new THREE.LineBasicMaterial({ color: colorEdge })
    );
    mesh.add(objectEdges);
}
