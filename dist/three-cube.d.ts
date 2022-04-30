declare module "three-cube" {
    export class THREECube {
        /**
         * This applies only for a 3x3x3 arrangement.
         * @param {Array<string>|string} turns
         * @returns {Array<string>}
         */
        static SingmasterToCubeNotation(turns: Array<string> | string): Array<string>;
        /**
         * Creates an Grid arrangement of cubes in x, y and z axes. Logically the indexing of the layers
         * follows the negative axis of the direction in question.
         *
         * Ex: The layers in the x plane are indexed x0, x1, x2.. With x0 having the highest position x value
         * @param {CubeOptions} options
         */
        constructor(options: CubeOptions);
        scene: THREE.Scene;
        cubeSize: number;
        cubes: THREE.Object3D[];
        layout: {
            x: number;
            y: number;
            z: number;
        };
        turns: string[];
        state: number;
        unbindHandlers: () => void;
        position: THREE.Vector3;
        /**
         * Removes all cubes from scene. Unbinds handlers.
         */
        destroy(): void;
        /**
         * Turns the arrangement passed number of times on randomly selected layers
         * with randomly selected direction
         * @param {number} count
         * @param {()=> void} [callback]
         */
        scramble(count: number, callback?: () => void): void;
        /**
         * Rotates the arrangment on specific layers passed as an array of moves.
         * A single move is a combination of 3 characaters, ex: y1'. The first character denotes which
         * axis to rotate about. The second character is an integer to select a layer in that axis.
         * The third optional character denotes the direction of rotation. ' defines anticlockwise.
         * When this is absent the rotation is always clockwise.
         * @param {string[]} moves Example: ["x0", "y1'", "y2", "x1", z0]
         * @param {()=>void} callback
         */
        turn(moves: string[], callback: () => void): void;
        /**
         * Returns all the cubes currently positioned in a particular axis and layer.
         * @param {"x"|"y"|"z"} axis
         * @param {number} index
         * @returns {Array<THREE.Object3D>}
         */
        getCubesInLayer(axis: "x" | "y" | "z", index: number): Array<THREE.Object3D>;
        /**
         * Resets the arrangement to initial state. Sets the turns empty
         */
        reset(): void;
    }
    export type CubeOptions = {
        scene: THREE.Scene;
        canvas: HTMLCanvasElement;
        camera: THREE.Camera;
        x: number;
        y: number;
        z: number;
        cubeSize: number;
        position?: THREE.Vector3;
        /**
         * hex color array of length 6
         */
        colors?: string[];
    };
    import * as THREE from "three";
}
