var $cVcZv$three = require("three");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "THREECube", () => $f89055a617ae15ea$export$13ed178991fcb7fc);

const $f89055a617ae15ea$var$DEFAULT_COLORS = [
    "#B90000",
    "#ffffff",
    "#FFD500",
    "#FF5900",
    "#009B48",
    "#0045AD"
];
const $f89055a617ae15ea$var$SNAPPING_TIME = 200;
const $f89055a617ae15ea$var$SPACING_FACTOR = 1.1;
/**
 * @typedef  CubeOptions
 * @type {object}
 * @property {THREE.Scene} scene
 * @property {HTMLCanvasElement} canvas
 * @property {THREE.Camera} camera
 * @property {number} x
 * @property {number} y
 * @property {number} z
 * @property {number} cubeSize
 * @property {THREE.Vector3} [position]
 * @property {()=>void} [onInteractStart] By default when mouse pointer starts 
 * to rotate the cube, a pointerup event is dispatched on renderig element to prevent 
 * any Control from rotating camera. This behaviour can be overridden by passing a 
 * custom function which may do nothing if needed.
 * @property {()=>void} [onInteractEnd] Optional callback when user has finished 
 * interacting with the cube.
 * @property {string[]} [colors] hex color array of length 6
 */ const $f89055a617ae15ea$var$AXES = [
    "x",
    "y",
    "z"
];
const $f89055a617ae15ea$var$STATES = {
    IDLE: 0,
    TURNING_CUBE: 1,
    AUTO_TURNING_CUBE: 2
};
class $f89055a617ae15ea$export$13ed178991fcb7fc {
    /**
	 * Creates an Grid arrangement of cubes in x, y and z axes. Logically the indexing of the layers
	 * follows the negative axis of the direction in question. 
	 * 
	 * Ex: The layers in the x plane are indexed x0, x1, x2.. With x0 having the highest position x value
	 * @param {CubeOptions} options 
	 */ constructor(options){
        this.scene = options.scene;
        this.cubeSize = options.cubeSize;
        this.cubes = [];
        this.layout = {
            x: options.x || 1,
            y: options.y || 1,
            z: options.z || 1
        };
        this.turns = [];
        this.state = $f89055a617ae15ea$var$STATES.IDLE;
        const rotationAxis = new $cVcZv$three.Vector3(1, 1, 1);
        /** @type {THREE.Object3D} */ let referenceCube;
        const rotatingCubes = [];
        let directionCheck = false;
        let totalRotated = 0;
        let snapDelta = 0;
        let previousTime = 0;
        const canvas = options.canvas;
        const camera = options.camera;
        const scene = this.scene;
        const interactStart = options.onInteractStart || (()=>{
            //this because we have no control over event handling of trackball controls
            canvas.dispatchEvent(new PointerEvent("pointerup"));
        });
        const interactEnd = options.onInteractEnd || (()=>{});
        const cubeSize = options.cubeSize;
        const gridMultiplier = cubeSize * $f89055a617ae15ea$var$SPACING_FACTOR;
        const _this = this;
        /** @type {"x"|"y"|"z"} */ let fixedNormal;
        const previous3DPoint = new $cVcZv$three.Vector3();
        const differenceVector = new $cVcZv$three.Vector3();
        const mousePoint = new $cVcZv$three.Vector2();
        const previousMousePoint = new $cVcZv$three.Vector2();
        const directionVector = new $cVcZv$three.Vector2();
        const startMousePoint = new $cVcZv$three.Vector2();
        const worldNormal = new $cVcZv$three.Vector3();
        this.unbindHandlers = ()=>{};
        let currentLayer = "z0";
        let colorArray = $f89055a617ae15ea$var$DEFAULT_COLORS;
        if (options.colors instanceof Array && options.colors.length == 6) colorArray = options.colors;
        this.position = new $cVcZv$three.Vector3(0, 0, 0);
        if (options.position instanceof $cVcZv$three.Vector3) this.position = options.position;
        function setBindings() {
            /**
			 * @param {MouseEvent} event 
			 */ function onCanvasMouseDown(event) {
                if (_this.state == $f89055a617ae15ea$var$STATES.AUTO_TURNING_CUBE) return;
                _this.state = $f89055a617ae15ea$var$STATES.IDLE;
                if (snapDelta) return;
                mousePoint.x = event.pageX;
                mousePoint.y = event.pageY;
                const vector2 = new $cVcZv$three.Vector2(mousePoint.x / canvas.width * 2 - 1, -(mousePoint.y / canvas.height) * 2 + 1);
                const raycaster = new $cVcZv$three.Raycaster();
                raycaster.setFromCamera(vector2, camera);
                const intersectionObject = raycaster.intersectObjects(scene.children)[0];
                if (intersectionObject) {
                    const foundCube = _this.cubes.find((cube)=>cube == intersectionObject.object
                    );
                    if (foundCube) {
                        interactStart();
                        _this.state = $f89055a617ae15ea$var$STATES.TURNING_CUBE;
                        referenceCube = intersectionObject.object;
                        worldNormal.copy(intersectionObject.face.normal);
                        worldNormal.transformDirection(referenceCube.matrixWorld);
                        previous3DPoint.copy(intersectionObject.point);
                        //calculate what normal it is??
                        if (Math.round(worldNormal.x)) fixedNormal = "x";
                        else if (Math.round(worldNormal.y)) fixedNormal = "y";
                        else if (Math.round(worldNormal.z)) fixedNormal = "z";
                    }
                }
                previousMousePoint.copy(mousePoint);
                startMousePoint.copy(mousePoint);
            }
            /**
			 * @param {MouseEvent} event 
			 */ function onCanvasMouseMove(event) {
                //event.preventDefault()
                if (snapDelta) return;
                mousePoint.x = event.pageX;
                mousePoint.y = event.pageY;
                if (_this.state == $f89055a617ae15ea$var$STATES.TURNING_CUBE) {
                    if (!directionCheck) {
                        if (previousMousePoint.distanceToSquared(mousePoint) < 3) return;
                        rotatingCubes.length = 0;
                        const vector2 = new $cVcZv$three.Vector2(mousePoint.x / canvas.width * 2 - 1, -(mousePoint.y / canvas.height) * 2 + 1);
                        const raycaster = new $cVcZv$three.Raycaster();
                        raycaster.setFromCamera(vector2, camera);
                        const intersectionObject = raycaster.intersectObjects(scene.children)[0];
                        differenceVector.copy(intersectionObject.point).sub(previous3DPoint);
                        const x = Math.abs(differenceVector.x);
                        const y = Math.abs(differenceVector.y);
                        const z = Math.abs(differenceVector.z);
                        /** @type {"x"|"y"|"z"} */ let rotationAbout = null;
                        if (fixedNormal == "x") rotationAbout = z > y ? "y" : "z";
                        else if (fixedNormal == "y") rotationAbout = x > z ? "z" : "x";
                        else if (fixedNormal == "z") rotationAbout = y > x ? "x" : "y";
                        if (rotationAbout) {
                            setRotationAbout(rotationAbout);
                            directionCheck = true;
                        }
                    } else {
                        const x = mousePoint.x - previousMousePoint.x;
                        const y = mousePoint.y - previousMousePoint.y;
                        const rotationAngle = (x * directionVector.x + y * directionVector.y) / 100;
                        totalRotated += rotationAngle;
                        rotatingCubes.forEach((c)=>$f89055a617ae15ea$var$rotateAroundWorldAxis(c, rotationAxis, rotationAngle, _this.position)
                        );
                    }
                    previousMousePoint.copy(mousePoint);
                }
            }
            function onDocumentMouseUp() {
                if (_this.state === $f89055a617ae15ea$var$STATES.TURNING_CUBE) {
                    interactEnd();
                    commitTurn();
                }
                if (_this.state !== $f89055a617ae15ea$var$STATES.AUTO_TURNING_CUBE) _this.state = $f89055a617ae15ea$var$STATES.IDLE;
                directionCheck = false;
            //controls.enabled = true
            }
            /**
			 * @param {"x"|"y"|"z"} axis 
			 */ function setRotationAbout(axis) {
                rotationAxis.set(0, 0, 0);
                rotationAxis[axis] = 1;
                rotatingCubes.length = 0;
                const dividedPos = (referenceCube.position[axis] - _this.position[axis]) / gridMultiplier;
                let startPos = (options[axis] - 1) / 2;
                let index = startPos - dividedPos;
                currentLayer = axis + index;
                const layerCubes = _this.getCubesInLayer(axis, index);
                rotatingCubes.push(...layerCubes);
                const otherAxis = $f89055a617ae15ea$var$AXES.find((oAxis)=>oAxis != axis && oAxis != fixedNormal
                );
                let increment = worldNormal[fixedNormal] > 0 ? 2 : -2;
                if (fixedNormal == "z" && axis == "x" || fixedNormal == "x" && axis == "y" || fixedNormal == "y" && axis == "z") increment = -increment;
                previous3DPoint[otherAxis] += increment;
                const projection = previous3DPoint.project(camera);
                projection.x = (projection.x + 1) / 2 * canvas.width;
                projection.y = -(projection.y - 1) / 2 * canvas.height;
                directionVector.set(projection.x, projection.y).sub(startMousePoint);
                directionVector.normalize();
            }
            /**
			 * Decides if a turn should happen. Also calculates a snap delta
			 */ function commitTurn() {
                let anticlockwiseTurn = false;
                let doubleTurn = false;
                const direction = Math.sign(totalRotated);
                totalRotated = Math.abs(totalRotated);
                let slot = Math.floor(totalRotated / (Math.PI / 2)) * direction;
                if (totalRotated % (Math.PI / 2) > Math.PI / 4) slot += 1 * direction;
                const otherAxes = $f89055a617ae15ea$var$AXES.filter((axis)=>!rotationAxis[axis]
                );
                const nonSymmetricRotation = options[otherAxes[0]] != options[otherAxes[1]];
                if (nonSymmetricRotation && direction * slot % 2 == 1) slot += 1 * direction;
                slot %= 4;
                /**
				 * Negative value of direction is a clockwise turn when looked at 0th layers of x,y and z
				 */ if (direction > 0) anticlockwiseTurn = true;
                if (Math.abs(slot) == 3) anticlockwiseTurn = !anticlockwiseTurn;
                if (Math.abs(slot) == 2) {
                    doubleTurn = true;
                    anticlockwiseTurn = false;
                }
                snapDelta = direction * (direction * slot * (Math.PI / 2) - totalRotated);
                if (slot) {
                    _this.turns.push(currentLayer + (anticlockwiseTurn ? "'" : ""));
                    if (doubleTurn) _this.turns.push(currentLayer);
                }
                totalRotated = 0;
            }
            canvas.addEventListener("pointerdown", onCanvasMouseDown);
            document.addEventListener("pointermove", onCanvasMouseMove);
            document.addEventListener("pointerup", onDocumentMouseUp);
            _this.unbindHandlers = function() {
                canvas.removeEventListener("pointerdown", onCanvasMouseDown);
                document.removeEventListener("pointermove", onCanvasMouseMove);
                document.removeEventListener("pointerup", onDocumentMouseUp);
            };
        }
        function createCubes() {
            let indexedPosition = 0;
            let zPos = (options.z - 1) / 2;
            const id = Math.random();
            const noColor = "#000000";
            for(let z = 0; z < options.z; z++){
                let yPos = (options.y - 1) / 2;
                for(let y = 0; y < options.y; y++){
                    let xPos = (options.x - 1) / 2;
                    for(let x = 0; x < options.x; x++){
                        indexedPosition++;
                        const faceColors = [
                            x == 0 ? colorArray[3] : noColor,
                            x + 1 == options.x ? colorArray[1] : noColor,
                            y == 0 ? colorArray[5] : noColor,
                            y + 1 == options.y ? colorArray[4] : noColor,
                            z == 0 ? colorArray[2] : noColor,
                            z + 1 == options.z ? colorArray[0] : noColor, 
                        ];
                        const geometry = new $cVcZv$three.BoxGeometry(cubeSize, cubeSize, cubeSize);
                        const materials = [];
                        faceColors.forEach((color)=>materials.push(new $cVcZv$three.MeshPhongMaterial({
                                color: color
                            }))
                        );
                        const cube = new $cVcZv$three.Mesh(geometry, materials);
                        cube.name = `CUBE_${id}_${indexedPosition}`;
                        cube.position.x = _this.position.x + xPos * gridMultiplier;
                        cube.position.y = _this.position.y + yPos * gridMultiplier;
                        cube.position.z = _this.position.z + zPos * gridMultiplier;
                        scene.add(cube);
                        _this.cubes.push(cube);
                        xPos -= 1;
                    }
                    yPos -= 1;
                }
                zPos -= 1;
            }
        }
        /**
		 * @param {number} timeStamp 
		 */ function snap(timeStamp) {
            if (snapDelta) {
                let delta = snapDelta * ((timeStamp - previousTime) / $f89055a617ae15ea$var$SNAPPING_TIME);
                if (snapDelta < 0) delta = Math.max(snapDelta - totalRotated, delta);
                else delta = Math.min(snapDelta - totalRotated, delta);
                rotatingCubes.forEach((c)=>$f89055a617ae15ea$var$rotateAroundWorldAxis(c, rotationAxis, delta, _this.position)
                );
                totalRotated += delta;
                if (Math.abs(totalRotated - snapDelta) < 0.0001) {
                    totalRotated = 0;
                    snapDelta = 0;
                    const halfGridMultiplier = gridMultiplier / 2;
                    rotatingCubes.forEach((cube)=>{
                        cube.position.sub(_this.position);
                        cube.position.x = Math.round(cube.position.x / halfGridMultiplier) * halfGridMultiplier;
                        cube.position.y = Math.round(cube.position.y / halfGridMultiplier) * halfGridMultiplier;
                        cube.position.z = Math.round(cube.position.z / halfGridMultiplier) * halfGridMultiplier;
                        cube.position.add(_this.position);
                    });
                }
            }
        }
        /**
		 * @param {number} [timeStamp] 
		 */ function perFrame(timeStamp) {
            window.requestAnimationFrame(perFrame);
            snap(timeStamp);
            previousTime = timeStamp;
        }
        createCubes();
        setBindings();
        perFrame();
    }
    /**
	 * Removes all cubes from scene. Unbinds handlers.
	 */ destroy() {
        this.cubes.forEach((cube)=>this.scene.remove(cube)
        );
        this.unbindHandlers();
    }
    /**
	 * Turns the arrangement passed number of times on randomly selected layers
	 * with randomly selected direction
	 * @param {number} count
	 * @param {()=> void} [callback]
	 */ scramble(count, callback) {
        const directions = [];
        for(let i = 0; i < count; i++){
            const axis = $f89055a617ae15ea$var$AXES[Math.floor(Math.random() * 3)];
            const layer = Math.floor(Math.random() * this.layout[axis]);
            const direction = Math.random() > 0.5 ? "'" : "";
            const turnCode = `${axis}${layer}${direction}`;
            if (turnCode + "'" === directions[i - 1] || turnCode === directions[i - 1] + "'") {
                i--;
                continue;
            }
            directions.push(`${axis}${layer}${direction}`);
        }
        console.log(directions);
        this.turn(directions, callback);
    }
    /**
	 * Rotates the arrangment on specific layers passed as an array of moves. 
	 * A single move is a combination of 3 characaters, ex: y1'. The first character denotes which
	 * axis to rotate about. The second character is an integer to select a layer in that axis.
	 * The third optional character denotes the direction of rotation. ' defines anticlockwise. 
	 * When this is absent the rotation is always clockwise.
	 * @param {string[]} moves Example: ["x0", "y1'", "y2", "x1", z0]
	 * @param {()=>void} callback
	 */ turn(moves, callback) {
        let currentIndex = 0;
        let turnComplete = false;
        let previousTime = 0;
        let totalRotated = 0;
        let endRotation = Math.PI / 2;
        const cubesToRotate = [];
        const rotationAxis = new $cVcZv$three.Vector3();
        let rotationDirection = -1;
        this.state = $f89055a617ae15ea$var$STATES.AUTO_TURNING_CUBE;
        const _this = this;
        const halfGridMultiplier = this.cubeSize * $f89055a617ae15ea$var$SPACING_FACTOR / 2;
        /**
		 * @param {boolean} [dontAdd]
		 * @returns {boolean}
		 */ function finishSingleMove(dontAdd) {
            if (turnComplete) {
                if (!dontAdd) _this.turns.push(moves[currentIndex]);
                currentIndex++;
                if (currentIndex >= moves.length) return true;
                else {
                    startMove(currentIndex);
                    return false;
                }
            }
        }
        function finishMoves() {
            _this.cubes.forEach((cube)=>{
                cube.position.sub(_this.position);
                cube.position.x = Math.round(cube.position.x / halfGridMultiplier) * halfGridMultiplier;
                cube.position.y = Math.round(cube.position.y / halfGridMultiplier) * halfGridMultiplier;
                cube.position.z = Math.round(cube.position.z / halfGridMultiplier) * halfGridMultiplier;
                cube.position.add(_this.position);
            });
            _this.state = $f89055a617ae15ea$var$STATES.IDLE;
            callback && callback();
        }
        /**
		 * @param {number} index 
		 */ function startMove(index) {
            rotationAxis.set(0, 0, 0);
            const layerAxis = moves[index][0];
            if ($f89055a617ae15ea$var$AXES.indexOf(layerAxis) === -1) {
                console.warn("Not a move! Skipping..");
                finishSingleMove(true);
                return;
            }
            rotationAxis[layerAxis] = 1;
            const layerIndex = parseInt(moves[index].substring(1));
            if (isNaN(layerIndex) || layerIndex >= _this.layout[layerAxis] || layerIndex < 0) {
                console.warn("Incorrect layer selected! Skipping..");
                finishSingleMove(true);
                return;
            }
            rotationDirection = moves[index][moves[index].length - 1] == "'" ? 1 : -1;
            cubesToRotate.length = 0;
            cubesToRotate.push(..._this.getCubesInLayer(layerAxis, layerIndex));
            turnComplete = false;
            totalRotated = 0;
            const otherAxes = $f89055a617ae15ea$var$AXES.filter((axis)=>!rotationAxis[axis]
            );
            const nonSymmetricRotation = _this.layout[otherAxes[0]] != _this.layout[otherAxes[1]];
            endRotation = Math.PI / 2;
            if (nonSymmetricRotation) endRotation = Math.PI;
        }
        /**
		 * @param {number} timeStamp 
		 */ function turnStep(timeStamp) {
            if (previousTime == 0) previousTime = timeStamp;
            let angleToRotate = Math.PI / 2 * ((timeStamp - previousTime) / $f89055a617ae15ea$var$SNAPPING_TIME);
            previousTime = timeStamp;
            totalRotated += angleToRotate;
            if (totalRotated >= endRotation) {
                turnComplete = true;
                angleToRotate -= totalRotated - endRotation;
            }
            cubesToRotate.forEach((cube)=>$f89055a617ae15ea$var$rotateAroundWorldAxis(cube, rotationAxis, angleToRotate * rotationDirection, _this.position)
            );
            if (!finishSingleMove()) window.requestAnimationFrame(turnStep);
            else finishMoves();
        }
        startMove(currentIndex);
        turnStep(0);
    }
    /**
	 * Returns all the cubes currently positioned in a particular axis and layer.
	 * @param {"x"|"y"|"z"} axis 
	 * @param {number} index 
	 * @returns {Array<THREE.Object3D>}
	 */ getCubesInLayer(axis, index) {
        let startPos = (this.layout[axis] - 1) / 2;
        const position = (startPos - index) * this.cubeSize * $f89055a617ae15ea$var$SPACING_FACTOR + this.position[axis];
        return this.cubes.filter((cube)=>Math.abs(cube.position[axis] - position) < 0.0000001
        );
    }
    /**
	 * This applies only for a 3x3x3 arrangement.
	 * @param {Array<string>|string} turns 
	 * @returns {Array<string>}
	 */ static SingmasterToCubeNotation(turns) {
        let arrayTurns;
        if (typeof turns == "string") arrayTurns = turns.split(" ");
        else arrayTurns = turns;
        const cubeNotation = [];
        const map = {
            "R": "x0",
            "L": "x2'",
            "U": "y0",
            "D": "y2'",
            "F": "z0",
            "B": "z2'"
        };
        arrayTurns.forEach((turn)=>{
            let cubeTurn = map[turn[0]];
            if (turn[turn.length - 1] === "'") cubeTurn += "'";
            cubeTurn = cubeTurn.replace("''", "");
            cubeNotation.push(cubeTurn);
            if (turn[turn.length - 1] === "2") cubeNotation.push(cubeTurn);
        });
        return cubeNotation;
    }
    /**
	 * Resets the arrangement to initial state. Sets the turns empty
	 */ reset() {
        const gridMultiplier = this.cubeSize * $f89055a617ae15ea$var$SPACING_FACTOR;
        let index = 0;
        let zPos = (this.layout.z - 1) / 2;
        for(let z = 0; z < this.layout.z; z++){
            let yPos = (this.layout.y - 1) / 2;
            for(let y = 0; y < this.layout.y; y++){
                let xPos = (this.layout.x - 1) / 2;
                for(let x = 0; x < this.layout.x; x++){
                    let cube = this.cubes[index];
                    cube.position.x = this.position.x + xPos * gridMultiplier;
                    cube.position.y = this.position.y + yPos * gridMultiplier;
                    cube.position.z = this.position.z + zPos * gridMultiplier;
                    cube.rotation.set(0, 0, 0);
                    cube.quaternion.set(0, 0, 0, 1);
                    xPos -= 1;
                    index++;
                }
                yPos -= 1;
            }
            zPos -= 1;
        }
        this.turns.length = 0;
    }
}
const $f89055a617ae15ea$var$matrixAux = new $cVcZv$three.Matrix4() // global auxiliar variable
;
/**
 * @param {THREE.Object3D} obj
 * @param {THREE.Vector3} axis
 * @param {number} radians
 * @param {THREE.Vector3} pivot
 */ function $f89055a617ae15ea$var$rotateAroundWorldAxis(obj, axis, radians, pivot) {
    obj.position.sub(pivot);
    obj.updateMatrix();
    $f89055a617ae15ea$var$matrixAux.makeRotationAxis(axis, radians);
    obj.matrix.multiplyMatrices($f89055a617ae15ea$var$matrixAux, obj.matrix) // r56
    ;
    $f89055a617ae15ea$var$matrixAux.extractRotation(obj.matrix);
    obj.rotation.setFromRotationMatrix($f89055a617ae15ea$var$matrixAux, obj.rotation.order);
    obj.position.setFromMatrixPosition(obj.matrix);
    obj.position.add(pivot);
}


//# sourceMappingURL=three-cube.js.map
