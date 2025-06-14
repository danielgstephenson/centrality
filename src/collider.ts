import { Contact, World } from 'planck'
import { Actor } from './actors/actor.js'
import { Unit } from './actors/unit.js'

export class Collider {
  world: World

  constructor (world: World) {
    this.world = world
    this.world.on('begin-contact', contact => this.beginContact(contact))
  }

  beginContact (contact: Contact): void {
    const fixtureA = contact.getFixtureA()
    const fixtureB = contact.getFixtureB()
    const actorA = fixtureA.getUserData() as Actor
    const actorB = fixtureB.getUserData() as Actor
    if (actorA instanceof Unit && actorB instanceof Unit) {
      if (actorA.team === actorB.team) {
        actorA.dead = true
        actorB.dead = true
        return
      }
      const unit0 = actorA.team === 0 ? actorA : actorB
      const unit1 = actorA.team === 1 ? actorA : actorB
      if (unit0.role === unit1.role) {
        unit0.dead = true
        return
      }
      unit1.dead = true
    }
  }
}
