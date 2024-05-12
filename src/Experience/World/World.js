import Experience from '../Experience.js'
import Environment from './Environment.js'
import Page from './Page.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.camera = this.experience.camera;
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.html = this.experience.html
        this.sound = this.experience.sound
        this.debug = this.experience.debug.panel

        // Wait for resources
        this.resources.on('ready', () =>
        {
            this.html.playButton.classList.add("fade-in");


            this.experience.time.start = Date.now()
            this.experience.time.elapsed = 0

            // Setup
            this.page = new Page()
            this.environment = new Environment()

            // Remove preloader
            this.html.preloader.classList.add("preloaded");
            this.html.preloader.remove();
            this.html.playButton.remove();

            // Animation timeline
            this.animationPipeline();

            //this.html.playButton.addEventListener('click', () => {

                //this.html.playButton.classList.replace("fade-in", "fade-out");
                //this.sound.createSounds();

            //     setTimeout(() => {
            //         this.experience.time.start = Date.now()
            //         this.experience.time.elapsed = 0
            //
            //         // Setup
            //         this.environment = new Environment()
            //
            //         // Remove preloader
            //         this.html.preloader.classList.add("preloaded");
            //         setTimeout(() => {
            //             this.html.preloader.remove();
            //             this.html.playButton.remove();
            //         }, 2500);
            //
            //         // Animation timeline
            //         this.animationPipeline();
            //     }, 100);
            // //}, { once: true });
        })
    }

    animationPipeline() {
        // if ( this.text )
        //     this.text.animateTextShow()

        if ( this.camera )
            this.camera.animateCameraPosition()
    }

    resize() {
        this.page.resize()
    }

    scroll()
    {
        if ( this.page )
            this.page.scroll()
    }

    update()
    {
        if(this.page)
            this.page.update()
    }
}
