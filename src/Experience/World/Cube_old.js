import * as THREE from 'three'
import Experience from '../Experience.js'
import cubeVertexShader from '../Shaders/Cube/vertex.glsl'
import cubeFragmentShader from '../Shaders/Cube/fragment.glsl'
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import gsap from "gsap";

export default class Cube {
    constructor() {
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.camera = this.experience.camera
        this.renderer = this.experience.renderer.instance
        this.resources = this.experience.resources

        this.timeline = this.experience.timeline;

        this.setModel()
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
        //
        // console.log(geometries)
        //
        // // merge geometries
        // const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, false)
        //
        // // create tor geometry
        // const torGeometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
        //
        // /**
        //  * Fireflies
        //  */
        // // Geometry
        const firefliesGeometry = new THREE.BufferGeometry()

        const firefliesCount = 1
        const dd = makeTexture(geometries[1]);
        console.log(dd)
        let positionArray = geometries[1].attributes.position.array

        // array to datatexture
        //const dataTexture = new THREE.DataTexture(geometries[1].attributes.position.array, 128, 128, THREE.RGBFormat, THREE.FloatType)

        // Преобразование позиций вершин в формат для DataTexture
        const positions = geometries[1].attributes.position.array;
        const textureSize = Math.ceil(positions.length / 3);
        const data = new Float32Array(textureSize * textureSize * 3); // 3 компонента на пиксель


        for ( let i = 0; i < data.length; i ++ ) {
            const stride = i * 3;
            data[ stride ] = 255;
            data[ stride + 1 ] = 255;
            data[ stride + 2 ] = 255;
        }

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


        for(let i = 0; i < geometries[1].attributes.position.array.length; i++)
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
        firefliesGeometry.setAttribute('aIndex', geometries[1].index)
        //firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

        // Material
        //const firefliesMaterial = new THREE.PointsMaterial({ size: 0.1, sizeAttenuation: true })
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
        const fireflies = new THREE.Points(firefliesGeometry, this.firefliesMaterial)

        //fireflies.renderOrder = 8
        //fireflies.position.z = -10
        this.scene.add(fireflies)
        //
        //
        //
        //
        //
        //
        //
        //
        //
        //
        // ////////////////////
        //
        //
        // let group;
        // let container, stats;
        // this.particlesData = [];
        // this.pointCloud;
        // this.particlePositions;
        // this.linesMesh;
        //
        // this.maxParticleCount = 1000;
        // this.particleCount = 500;
        // const r = 800;
        // this.rHalf = r / 2;
        //
        // this.effectController = {
        //     showDots: true,
        //     showLines: true,
        //     minDistance: 55,
        //     limitConnections: true,
        //     maxConnections: 1,
        //     particleCount: 500
        // };
        //
        //
        // group = new THREE.Group();
        // this.scene.add( group );
        //
        // const helper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxGeometry( r, r, r ) ) );
        // helper.material.color.setHex( 0x474747 );
        // helper.material.blending = THREE.AdditiveBlending;
        // helper.material.transparent = true;
        // group.add( helper );
        //
        // const segments = this.maxParticleCount * this.maxParticleCount;
        //
        // this.positions = new Float32Array( segments * 3 );
        // this.colors = new Float32Array( segments * 3 );
        //
        // const pMaterial = new THREE.PointsMaterial( {
        //     color: 0xFFFFFF,
        //     size: 3,
        //     blending: THREE.AdditiveBlending,
        //     transparent: true,
        //     sizeAttenuation: false
        // } );
        //
        // this.particles = new THREE.BufferGeometry();
        // this.particlePositions = new Float32Array( this.maxParticleCount * 3 );
        //
        //
        // this.particleCount = torGeometry.attributes.position.array.length;
        // this.maxParticleCount = torGeometry.attributes.position.array.length;
        //
        // for ( let i = 0; i < this.maxParticleCount; i ++ ) {
        //
        //     const x = Math.random() * r - r / 2;
        //     const y = Math.random() * r - r / 2;
        //     const z = Math.random() * r - r / 2;
        //
        //     this.particlePositions[ i * 3 ] = x;
        //     this.particlePositions[ i * 3 + 1 ] = y;
        //     this.particlePositions[ i * 3 + 2 ] = z;
        //
        //     this.colors[ i * 3 ] = 1;
        //     this.colors[ i * 3 + 1 ] = 1;
        //     this.colors[ i * 3 + 2 ] = 1;
        //
        //     // add it to the geometry
        //     this.particlesData.push( {
        //         velocity: new THREE.Vector3( - 1 + Math.random() * 2, - 1 + Math.random() * 2, - 1 + Math.random() * 2 ),
        //         numConnections: 0
        //     } );
        //
        // }
        // this.particlePositions = torGeometry.attributes.position.array;
        //
        // // scale particlePositions
        // for ( let i = 0; i < this.particlePositions.length; i ++ ) {
        //     this.particlePositions[i] *= 40.0
        // }
        //
        //
        // this.particles.setDrawRange( 0, this.particleCount );
        // this.particles.setAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
        //
        // // create the particle system
        // this.pointCloud = new THREE.Points( this.particles, pMaterial );
        // //group.add( this.pointCloud );
        //
        // const geometry = new THREE.BufferGeometry();
        //
        // geometry.setAttribute( 'position', new THREE.BufferAttribute( this.particlePositions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
        // geometry.setAttribute( 'color', new THREE.BufferAttribute( this.colors, 3 ).setUsage( THREE.DynamicDrawUsage ) );

        //geometry.computeBoundingSphere();

        //geometry.setDrawRange( 0, 0 );

        // // new wareframe material
        const material = new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            wireframe: true,
        } );

        // clear indexes

        this.mesh = new THREE.Mesh( geometries[1], material );

        //this.scene.add( this.mesh );

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

    updateLines()
    {
        let vertexpos = 0;
        let colorpos = 0;
        let numConnected = 0;

        for ( let i = 0; i < this.particleCount; i ++ )
            this.particlesData[ i ].numConnections = 0;

        for ( let i = 0; i < this.particleCount; i ++ ) {

            // get the particle
            const particleData = this.particlesData[ i ];

            this.particlePositions[ i * 3 ] += particleData.velocity.x;
            this.particlePositions[ i * 3 + 1 ] += particleData.velocity.y;
            this.particlePositions[ i * 3 + 2 ] += particleData.velocity.z;

            if ( this.particlePositions[ i * 3 + 1 ] < - this.rHalf || this.particlePositions[ i * 3 + 1 ] > this.rHalf )
                particleData.velocity.y = - particleData.velocity.y;

            if ( this.particlePositions[ i * 3 ] < - this.rHalf || this.particlePositions[ i * 3 ] > this.rHalf )
                particleData.velocity.x = - particleData.velocity.x;

            if ( this.particlePositions[ i * 3 + 2 ] < - this.rHalf || this.particlePositions[ i * 3 + 2 ] > this.rHalf )
                particleData.velocity.z = - particleData.velocity.z;

            if ( this.effectController.limitConnections && particleData.numConnections >= this.effectController.maxConnections )
                continue;

            // Check collision
            for ( let j = i + 1; j < this.particleCount; j ++ ) {

                const particleDataB = this.particlesData[ j ];
                if ( this.effectController.limitConnections && particleDataB.numConnections >= this.effectController.maxConnections )
                    continue;

                const dx = this.particlePositions[ i * 3 ] - this.particlePositions[ j * 3 ];
                const dy = this.particlePositions[ i * 3 + 1 ] - this.particlePositions[ j * 3 + 1 ];
                const dz = this.particlePositions[ i * 3 + 2 ] - this.particlePositions[ j * 3 + 2 ];
                const dist = Math.sqrt( dx * dx + dy * dy + dz * dz );

                if ( dist < this.effectController.minDistance ) {

                    particleData.numConnections ++;
                    particleDataB.numConnections ++;

                    const alpha = 1.0 - dist / this.effectController.minDistance;

                    this.positions[ vertexpos ++ ] = this.particlePositions[ i * 3 ];
                    this.positions[ vertexpos ++ ] = this.particlePositions[ i * 3 + 1 ];
                    this.positions[ vertexpos ++ ] = this.particlePositions[ i * 3 + 2 ];

                    this.positions[ vertexpos ++ ] = this.particlePositions[ j * 3 ];
                    this.positions[ vertexpos ++ ] = this.particlePositions[ j * 3 + 1 ];
                    this.positions[ vertexpos ++ ] = this.particlePositions[ j * 3 + 2 ];

                    this.colors[ colorpos ++ ] = alpha;
                    this.colors[ colorpos ++ ] = alpha;
                    this.colors[ colorpos ++ ] = alpha;

                    this.colors[ colorpos ++ ] = alpha;
                    this.colors[ colorpos ++ ] = alpha;
                    this.colors[ colorpos ++ ] = alpha;

                    numConnected ++;

                }

            }

        }


        this.linesMesh.geometry.setDrawRange( 0, numConnected * 2 );
        this.linesMesh.geometry.attributes.position.needsUpdate = true;
        this.linesMesh.geometry.attributes.color.needsUpdate = true;

        this.pointCloud.geometry.attributes.position.needsUpdate = true;
    }

    update() {
        this.firefliesMaterial.uniforms.uTime.value = this.time.elapsed

        //this.updateLines();
    }
}
