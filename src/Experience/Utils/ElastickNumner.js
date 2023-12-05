export default class ElasticNumber {
    constructor(initialValue) {
        this.value = initialValue;
        this.target = initialValue;
        this.speed = 3;
    }

    update(time) {
        let delta = this.target - this.value;

        this.value += delta * (this.speed * Math.min(time, 0.1));
        return true;
    }
}
