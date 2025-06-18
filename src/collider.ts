import { Contact, World } from 'planck'
import { Actor } from './actors/actor.js'
import { Unit } from './actors/unit.js'
import { Station } from './actors/station.js'

export class Collider {
  world: World

  constructor (world: World) {
    this.world = world
    this.world.on('begin-contact', contact => this.beginContact(contact))
    this.world.on('pre-solve', contact => this.preSolve(contact))
  }

  beginContact (contact: Contact): void {}

  preSolve (contact: Contact): void {
    const fixtureA = contact.getFixtureA()
    const fixtureB = contact.getFixtureB()
    const actorA = fixtureA.getUserData() as Actor
    const actorB = fixtureB.getUserData() as Actor
    if (actorA instanceof Unit && actorB instanceof Station) {
      if (actorA.team === actorB.team) contact.setEnabled(false)
    }
    if (actorA instanceof Station && actorB instanceof Unit) {
      if (actorA.team === actorB.team) contact.setEnabled(false)
    }
    if (actorA instanceof Unit && actorB instanceof Unit) {
      contact.setEnabled(false)
      if (actorA.team === actorB.team) {
        actorA.die()
        actorB.die()
        return
      }
      const unit0 = actorA.team === 0 ? actorA : actorB
      const unit1 = actorA.team === 1 ? actorA : actorB
      if (unit0.role === unit1.role) {
        unit0.die()
        return
      }
      unit1.die()
    }
  }
}
