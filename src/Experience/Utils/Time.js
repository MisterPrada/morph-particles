import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.start = Date.now()
        this.current = this.start
        this.playing = true
        this.elapsed = 0
        this.delta = 0.016

        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }

    tick()
    {
        const currentTime = Date.now()
        this.delta = Math.min( (currentTime - this.current) * 0.001, 0.016)
        this.current = currentTime
        this.elapsed = (this.current - this.start) * 0.001

        if(this.delta > 0.06)
        {
            this.delta = 0.06
        }

        this.trigger('tick')

        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }
}
