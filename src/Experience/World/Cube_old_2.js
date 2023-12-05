import * as THREE from 'three'
import Experience from '../Experience.js'
import cubeVertexShader from '../Shaders/Cube/vertex.glsl'
import cubeFragmentShader from '../Shaders/Cube/fragment.glsl'
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import gsap from "gsap";
import {BufferGeometry} from "three";

import simVertex from '../Shaders/Particles/simulation.vert';
import simFragment from '../Shaders/Particles/simulation.frag';
import particlesVertex from '../Shaders/Particles/particles.vert';
import particlesFragment from '../Shaders/Particles/particles.frag';

import FBO from "../Utils/FBO.js";

export default class Cube {
    constructor() {
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.camera = this.experience.camera
        this.renderer = this.experience.renderer.instance
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes
        this.timeline = this.experience.timeline;

        this.tweaks = {
            pointSize: 1.2,
            speed: 0.3,
            curlFreq: 0.25,
            opacity: 0.35,
        };

        this.resource = this.resources.items.cubeModel
        this.mesh = this.resource.scene

        this.setFBOParticles()
    }

    setModel(){
        this.resource = this.resources.items.cubeModel
        this.mesh = this.resource.scene
        //this.mesh.scale.set(100, 100, 100)
        //this.scene.add(this.mesh)

        //
        // // get mesh merge geometries
        const geometries = []
        this.mesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                geometries.push(child.geometry)
            }
        })

        // merge geometries
        const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, false)


        /**
         * Fireflies
         */
        // Geometry
        const firefliesGeometry = new THREE.BufferGeometry()

        const sphereGeometry = this.mesh.children[0].geometry.clone();
        const torGeometry = new THREE.TorusGeometry( 10, 3, 16, 100 );

        for ( let i = 0; i < torGeometry.attributes.position.array.length; ++i ) {
            torGeometry.attributes.position.array[i] /= 11.0
        }

        // const vertex_tmp = [];
        // let hashMap = [];
        //
        // for(let i = 0; i < geometries[1].attributes.position.array.length; i++)
        // {
        //     if(!geometries[1].attributes.position.array[i * 3 + 0]) {
        //         break
        //     }
        //
        //     const index = geometries[1].attributes.position.array[i * 3 + 0].toString() +
        //         geometries[1].attributes.position.array[i * 3 + 1].toString() +
        //         geometries[1].attributes.position.array[i * 3 + 2].toString();
        //
        //     if( hashMap[index] == undefined ){
        //         hashMap[index] = 1;
        //     }else{
        //         vertex_tmp.push(geometries[1].attributes.position.array[i * 3 + 0]);
        //         vertex_tmp.push(geometries[1].attributes.position.array[i * 3 + 1]);
        //         vertex_tmp.push(geometries[1].attributes.position.array[i * 3 + 3]);
        //     }
        // }
        //
        // const vertex = new Float32Array(vertex_tmp);

        const meshVertexTexture = this.makeTexture(sphereGeometry);
        const torVertexTexture = this.makeTexture(torGeometry);
        let positionArray = new Float32Array(30000)
        let aIndex = new Float32Array(positionArray.length / 3);


        for(let i = 1; i < positionArray.length; i++){
            aIndex[i] = i;
        }


        for(let i = 0; i < positionArray.length; i++)
        {
            positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4
            positionArray[i * 3 + 1] = Math.random() * 3
            positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4
        }

        // scale particlePositions
        // for ( let i = 0; i < geometries[0].length; i ++ ) {
        //     geometries[0][i] *= 1000.0
        // }

        firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
        //firefliesGeometry.setAttribute('aIndex', torGeometry.index)
        firefliesGeometry.setAttribute('aIndex',  new THREE.BufferAttribute(aIndex, 1))

        // Material
        this.firefliesMaterial = new THREE.ShaderMaterial({
            uniforms:
                {
                    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                    uSize: { value: 15.0 },
                    uTime: { value: 0 },
                    uResolution: { value: new THREE.Vector2(128, 128) },
                    uTexture: { value: meshVertexTexture },
                    uTorTexture: { value: torVertexTexture },
                },
            vertexShader: cubeVertexShader,
            fragmentShader: cubeFragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            //depthTest: false,
            wireframe: true,
        })

        // Points
        const fireflies = new THREE.Points(firefliesGeometry, this.firefliesMaterial)

        this.scene.add(fireflies)

    }

    setModel2(){
        // this.resource = this.resources.items.cubeModel
        // this.mesh = this.resource.scene


        /**
         * Fireflies
         */
            // Geometry
        const firefliesGeometry = new THREE.BufferGeometry()

        const sphereGeometry = this.mesh.children[0].geometry.clone();

        const vertex_tmp = [];
        let hashMap = [];

        for(let i = 0; i < sphereGeometry.attributes.position.count; i++)
        {
            if(isNaN(sphereGeometry.attributes.position.array[i * 3 + 3])) {
                break
            }



            const index = sphereGeometry.attributes.position.array[i * 3 + 0].toString() +
                sphereGeometry.attributes.position.array[i * 3 + 1].toString() +
                sphereGeometry.attributes.position.array[i * 3 + 2].toString();

            if( hashMap[index] == undefined ){
               hashMap[index] = 1;
            }else{
                vertex_tmp.push(sphereGeometry.attributes.position.array[i * 3 + 0]);
                vertex_tmp.push(sphereGeometry.attributes.position.array[i * 3 + 1]);
                vertex_tmp.push(sphereGeometry.attributes.position.array[i * 3 + 2]);
            }


            //if(i == 14) { break; }
        }

        const vertex = new Float32Array(vertex_tmp);
        const positionArray = new Float32Array(vertex.length)


        for(let i = 0; i < positionArray.length; i++){
            positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4
            positionArray[i * 3 + 1] = Math.random() * 3
            positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4
        }

        let aIndex = new Float32Array(sphereGeometry.attributes.position.count);
        for(let i = 0; i < positionArray.length; i++){
            aIndex[i] = i;
        }



        const bf = new THREE.BufferGeometry();

        console.log(positionArray)

        bf.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
        bf.setAttribute('aIndex',  new THREE.BufferAttribute(aIndex, 1))

        const bf2 = new THREE.BufferGeometry();



        bf2.setAttribute('position', new THREE.BufferAttribute(vertex, 3));
        bf2.setAttribute('aIndex',  new THREE.BufferAttribute(aIndex, 1))

        const dd = makeTexture(bf2);

        function makeTexture(g){

            let vertAmount = g.attributes.position.count;
            let texWidth = Math.ceil(Math.sqrt(vertAmount));
            let texHeight = Math.ceil(vertAmount / texWidth);

            let data = new Float32Array(texWidth * texHeight * 4);

            for(let i = 0; i < vertAmount; i++){
                data[i * 4 + 0] = g.attributes.position.getX(i);
                data[i * 4 + 1] = g.attributes.position.getY(i);
                data[i * 4 + 2] = g.attributes.position.getZ(i);
                data[i * 4 + 3] = 0;
            }

            let dataTexture = new THREE.DataTexture(data, texWidth, texHeight, THREE.RGBAFormat, THREE.FloatType);
            dataTexture.needsUpdate = true;

            return dataTexture;
        }


        // Material
        this.firefliesMaterial = new THREE.ShaderMaterial({
            uniforms:
                {
                    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                    uSize: { value: 15.0 },
                    uTime: { value: 0 },
                    uResolution: { value: new THREE.Vector2(128, 128) },
                    uTexture: { value: dd },
                },
            vertexShader: cubeVertexShader,
            fragmentShader: cubeFragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            //depthTest: false,
            wireframe: true,
        })

        // Points
        const fireflies = new THREE.Points(bf, this.firefliesMaterial)

        this.scene.add(fireflies)

    }

    makeTexture(g){

        let vertAmount = g.attributes.position.count;
        let texWidth = Math.ceil(Math.sqrt(vertAmount));
        let texHeight = Math.ceil(vertAmount / texWidth);

        let data = new Float32Array(texWidth * texHeight * 4);

        let randomTemp = Array.from(g.attributes.position.array);

        for(let i = 0; i < vertAmount; i++){
            let f = Math.floor(Math.random() * (randomTemp.length / 3) );

            // const x = g.attributes.position.getX(f)
            // const y = g.attributes.position.getY(f)
            // const z = g.attributes.position.getZ(f)
            const x = randomTemp[f * 3 + 0];
            const y = randomTemp[f * 3 + 1];
            const z = randomTemp[f * 3 + 2];
            const w = 0

            randomTemp.splice(f * 3, 3);

            data[i * 4 + 0] = x * 1.2;
            data[i * 4 + 1] = y * 1.2;
            data[i * 4 + 2] = z * 1.2;
            data[i * 4 + 3] = w;
        }

        let dataTexture = new THREE.DataTexture(data, texWidth, texHeight, THREE.RGBAFormat, THREE.FloatType);
        dataTexture.needsUpdate = true;

        return dataTexture;
    }

    setFBOParticles() {
        // width and height of FBO
        const width = 64;
        const height = 64;

        function parseMesh(g){
            var vertices = g.vertices;
            var total = vertices.length;
            var size = parseInt( Math.sqrt( total * 4 ) + .5 );
            var data = new Float32Array( size*size * 4 );
            for( var i = 0; i < total; i++ ) {
                data[i * 3] = vertices[i].x;
                data[i * 3 + 1] = vertices[i].y;
                data[i * 3 + 2] = vertices[i].z;
            }
            return data;
        }

        //returns an array of random 3D coordinates
        function getRandomData( width, height, size ){
            var len = width * height * 4;
            var data = new Float32Array( len );
            //while( len-- )data[len] = ( Math.random() -.5 ) * size ;
            for(let i = 0; i < len; i++){
                data[i * 3 + 0] = (Math.random() - 0.5) * size
                data[i * 3 + 1] = (Math.random() - 0.5) * size
                data[i * 3 + 2] = (Math.random() - 0.5) * size
            }

            return data;
        }



        //populate a Float32Array of random positions
        //var data = getRandomData( width, height, 256 );
        const sphereGeometry = this.mesh.children[0].geometry.clone();
        const torGeometry = new THREE.TorusGeometry( 10, 3, 16, 100 );

        for ( let i = 0; i < torGeometry.attributes.position.array.length; ++i ) {
            torGeometry.attributes.position.array[i] /= 11.0
        }
        //convertes it to a FloatTexture
        //var positions = new THREE.DataTexture( data, width, height, THREE.RGBAFormat, THREE.FloatType );
        //positions.needsUpdate = true;

        var uTextureA = this.makeTexture(sphereGeometry);
        // var data = getRandomData( width, height, 2 );
        // var positions = new THREE.DataTexture( data, width, height, THREE.RGBAFormat, THREE.FloatType );
        // positions.needsUpdate = true;
        // var uTextureA = positions;
        var uTextureB = this.makeTexture(torGeometry);

        //simulation shader used to update the particles' positions
        this.simMaterial = new THREE.ShaderMaterial({
            uniforms:{
                uTextureA: { type: "t", value: uTextureA },
                uTextureB: { type: "t", value: uTextureB },
                uTime: { value: 0},
            },
            vertexShader: simVertex,
            fragmentShader:  simFragment
        });

        //render shader to display the particles on screen
        //the 'positions' uniform will be set after the FBO.update() call
        this.renderMaterial = new THREE.ShaderMaterial( {
            uniforms: {
                uPositions: { value: null },
                uSize: { value: 20 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
            },
            vertexShader: particlesVertex,
            fragmentShader: particlesFragment,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        } );

        // Initialize the FBO
        this.fbo = new FBO(width, height, this.renderer, this.simMaterial, this.renderMaterial);

        // Add the particles to the scene
        this.scene.add(this.fbo.particles);
    }

    getRandomSpherePoint() {
        const u = Math.random();
        const v = Math.random();

        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random());

        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const vector = new THREE.Vector3();

        vector.x = r * sinPhi * cosTheta;
        vector.y = r * sinPhi * sinTheta;
        vector.z = r * cosPhi;

        return vector;
    }

    resize() {

    }

    setDebug() {
        // Debug
        if(this.debug.active)
        {
            //this.debugFolder = this.debug.gui.addFolder('Cube')
            //this.debugFolder.open()
        }
    }

    update() {
        //this.firefliesMaterial.uniforms.uTime.value = this.time.elapsed
        this.simMaterial.uniforms.uTime.value = this.time.elapsed

        this.fbo.update();

        //this.updateLines();
    }
}
