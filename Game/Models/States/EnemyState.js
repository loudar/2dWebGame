export class EnemyState {
    constructor(baseHealth = 100, health = baseHealth, baseSpeed = 1, speed = baseSpeed) {
        this.baseHealth = baseHealth;
        this.health = health;
        this.baseSpeed = baseSpeed;
        this.speed = speed;
        this.damageLock = null;
    }

    getHealth() {
        return this.health;
    }

    setHealth(health) {
        if (health < 0) {
            health = 0;
        }
        if (health > this.baseHealth) {
            health = this.baseHealth;
        }
        if (health < this.health) {
            if (this.damageLock !== null) {
                return;
            }
        }
        this.health = health;
    }

    setDamageLock() {
        if (this.damageLock !== null) {
            return;
        }
        this.damageLock = Date.now();
        setTimeout(() => {
            this.damageLock = null;
        }, 1000);
    }

    getBaseHealth() {
        return this.baseHealth;
    }

    setBaseHealth(baseHealth) {
        this.baseHealth = baseHealth;
        if (this.health > this.baseHealth) {
            this.health = this.baseHealth;
        }
    }

    getHealthPercentage() {
        return this.health / this.baseHealth;
    }

    getHealthPercentageString() {
        return `${Math.round(this.getHealthPercentage() * 100)}%`;
    }

    getHealthString() {
        return `${this.health}/${this.baseHealth}`;
    }
}