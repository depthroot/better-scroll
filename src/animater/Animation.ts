import Base, { Displacement } from './Base'
import {
  getNow,
  Probe,
  requestAnimationFrame,
  cancelAnimationFrame,
  EaseFn
} from '../util'

export default class Animation extends Base {
  scrollTo(
    displacementX: Displacement,
    displacementY: Displacement,
    time: number,
    easingFn: EaseFn | string
  ) {
    // time is 0
    if (!time) {
      const x = displacementX[1]
      const y = displacementY[1]
      this.translate(x, y)
      this.hooks.trigger(this.hooks.eventTypes.move, {
        x,
        y
      })
      // force reflow to put everything in position
      this._reflow = document.body.offsetHeight
      // maybe need reset position
      this.hooks.trigger(this.hooks.eventTypes.end, {
        x,
        y
      })
      return
    }
    this.animate(displacementX, displacementY, time, easingFn as EaseFn)
  }

  private animate(
    displacementX: Displacement,
    displacementY: Displacement,
    duration: number,
    easingFn: EaseFn
  ) {
    // departure
    let startX = displacementX[0]
    let startY = displacementY[0]
    // destinations
    let destX = displacementX[1]
    let destY = displacementY[1]
    let startTime = getNow()
    let destTime = startTime + duration

    const step = () => {
      let now = getNow()

      // js animation end
      if (now >= destTime) {
        this.pending = false
        this.translate(destX, destY)

        this.hooks.trigger(this.hooks.eventTypes.move, {
          x: destX,
          y: destY
        })

        this.hooks.trigger(this.hooks.eventTypes.end, {
          x: destX,
          y: destY
        })
        return
      }

      now = (now - startTime) / duration
      let easing = easingFn(now)
      let newX = (destX - startX) * easing + startX
      let newY = (destY - startY) * easing + startY

      this.translate(newX, newY)

      if (this.pending) {
        this.timer = requestAnimationFrame(step)
      }

      if (this.options.probeType === Probe.Realtime) {
        this.hooks.trigger(this.hooks.eventTypes.move, {
          x: newX,
          y: newY
        })
      }
    }

    this.pending = true
    cancelAnimationFrame(this.timer)
    step()
  }

  stop() {
    // still in requestFrameAnimation
    if (this.pending) {
      this.pending = false
      cancelAnimationFrame(this.timer)
      const pos = this.translater.getComputedPosition()
      this.hooks.trigger(this.hooks.eventTypes.forceStop, pos)
      this.forceStopped = true
    }
  }
}
