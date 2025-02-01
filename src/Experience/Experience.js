import * as THREE from 'three'

import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import Sound from "./Utils/Sound.js";

import sources from './sources.js'
import gsap from "gsap";
import MotionPathPlugin from "gsap/MotionPathPlugin";

let instance = null

export default class Experience
{
    constructor(_canvas)
    {
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this

        // Options
        this.targetElement = _canvas

        if(!this.targetElement)
        {
            console.warn('Missing \'targetElement\' property')
            return
        }


        /**
         * Default code to prevent double click to select text
         */
        this.setDefaultCode();
        this.setConfig()

        this.isMobile = isMobile.any()

        // Global access
        window.experience = this

        // Html Elements
        this.html = {}
        this.html.preloader = document.getElementById("preloader")
        this.html.playButton = document.getElementById("play-button")


        // Resources
        this.resources = new Resources(sources)

        // Options
        THREE.ColorManagement.enabled = false
        this.canvas = _canvas

        // Setup
        this.timeline = gsap.timeline({
            paused: true,
        });
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.cursor = { x: 0, y: 0 }
        this.scene = new THREE.Scene()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.sound = new Sound()
        this.world = new World()




        // Resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () =>
        {
            this.update()
            this.debug.stats && this.debug.stats.update();
        })

        // Mouse move event
        window.addEventListener('mousemove', (event) =>
        {
            this.cursor.x = event.clientX / this.sizes.width * 2 - 1
            this.cursor.y = - (event.clientY / this.sizes.height) * 2 + 1
        })

        // Scroll
        window.addEventListener('scroll', () =>
        {
            this.scroll()
        })

    }

    resize()
    {
        this.camera.resize()
        this.world.resize()
        this.renderer.resize()
        //this.sound.resize()
    }

    scroll()
    {
        this.world.scroll()
    }

    update()
    {
        if ( this.debug.active )
            this.debug.panel.refresh()
        this.timeline.time(this.time.elapsed);
        this.world.update()
        this.camera.update()

        this.renderer.update()
    }

    setDefaultCode(){
        window.isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };


        document.ondblclick = function (e) {
            e.preventDefault()
        }

        gsap.registerPlugin(MotionPathPlugin);
    }

    setConfig()
    {
        this.config = {}

        // Debug
        this.config.debug = window.location.hash === '#debug'

        // Pixel ratio
        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        // Width and height
        const boundings = this.targetElement.getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height || window.innerHeight
    }

    destroy()
    {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) =>
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()

                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if(this.debug.active)
            this.debug.ui.destroy()
    }
}
