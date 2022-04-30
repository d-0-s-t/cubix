# THREECube

This package lets you create and interact with a n1 x n2 x n3 arrangement of cubes in threejs. The layers in the arrangement can be turned to specific set of moves or alternatively they can be scrambled. User moves are recorded. Solutions are not available yet. As a lazy hack, the inverse of user moves would work.

A demo of this is hosted here:
[d0st.me/app/cubes](d0st.me/app/cubes)

# Installation 
If you are using node, install with

```
npm intall three-cube
```

If not, just import the module [src/index.js](https://github.com/d-0-s-t/three-cube/blob/master/src/three-cube.js). (If you are not using a bundler, take note to fix the imports)

# Usage

## Create a shiny new 4 x 4 x 4 ThreeCube Object:

```
currentPuzzle = new THREECube({
		x: 4, // number of cubes in x axis
		y: 4, // number of bubes in y axis
		z: 4, // number of cubes in z axis
		cubeSize: 10, // the size of each cube
		scene: scene, // a three.js scene
		camera: camera, // a three.js camera
		canvas: canvas // rendering canvas
})
```

When rotated around an axis containing equal number of cubes in both directions, the arrangement is rotated in steps of 90 degrees. If that is not the case the arrangement is rotated in steps of 180 degrees.

## To scramble the arrangement use:
```
// Turn the arrangment 17 times in the random axis, selecting a random layer and direction
currentPuzzle.scramble(17) 
```

## To make specific moves:
```
currentPuzzle.turn(["x0", "y1'", "z2", "z0'"])
```
When looking at the arrangement from positive z axis, this will perform the following moves

1. Turn the first layer in x-axis clockwise. This is an "R" move.
2. Turn the second layer from top anticlockwise.
3. Turn the third layer in front clockwise.
4. Turn the first layer in front anti-clockwise. This is a "F'" move.

## Bonus

```
//Resets the arrangement to initial state.
currentPuzzle.reset()
//Write all the moves made
console.log(currentPuzzle.turns) 
//Remove the cubes from scene. Unbind listeners
currentPuzzle.destroy()

//Convert a singmaster notation to Cube notation. Works only for 3x3x3
THREECube.SingmasterToCubeNotation(["R", "U", "B", "L2"])
THREECube.SingmasterToCubeNotation("R U B L2")
```