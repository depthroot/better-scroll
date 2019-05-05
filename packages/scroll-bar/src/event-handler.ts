import EventRegister from '@better-scroll/core/src/base/EventRegister'
import EventEmitter from '@better-scroll/core/src/base/EventEmitter'
import BScroll from '@better-scroll/core'
import { TouchEvent } from '@better-scroll/shared-utils/src/Touch'
import Indicator from './indicator'

interface EventHandlerOptions {
  disableMouse: boolean | ''
}

export default class EventHandler {
  public startEventRegister: EventRegister
  public moveEventRegister: EventRegister
  public endEventRegister: EventRegister
  public initiated: boolean
  public moved: boolean
  private lastPoint: number
  public bscroll: BScroll
  public hooks: EventEmitter

  constructor(
    public indicator: Indicator,
    public options: EventHandlerOptions
  ) {
    this.bscroll = indicator.bscroll
    this.startEventRegister = new EventRegister(this.indicator.el, [
      {
        name: options.disableMouse ? 'touchstart' : 'mousedown',
        handler: this._start.bind(this)
      }
    ])

    this.endEventRegister = new EventRegister(window, [
      {
        name: options.disableMouse ? 'touchend' : 'mouseup',
        handler: this._end.bind(this)
      }
    ])
    this.hooks = new EventEmitter(['touchStart', 'touchMove', 'touchEnd'])
  }

  private _start(e: TouchEvent) {
    let point = (e.touches ? e.touches[0] : e) as Touch

    e.preventDefault()
    e.stopPropagation()

    this.initiated = true
    this.moved = false
    this.lastPoint = point[this.indicator.keysMap.pointPos]

    const { disableMouse } = this.bscroll.options
    this.moveEventRegister = new EventRegister(window, [
      {
        name: disableMouse ? 'touchmove' : 'mousemove',
        handler: this._move.bind(this)
      }
    ])
    this.hooks.trigger('touchStart')
  }

  private _move(e: TouchEvent) {
    let point = (e.touches ? e.touches[0] : e) as Touch
    const pointPos = point[this.indicator.keysMap.pointPos]

    e.preventDefault()
    e.stopPropagation()

    let delta = pointPos - this.lastPoint
    this.lastPoint = pointPos

    if (!this.moved) {
      this.hooks.trigger('touchMove', this.moved, delta)
      this.moved = true
      return
    }

    this.hooks.trigger('touchMove', this.moved, delta)
  }

  private _end(e: TouchEvent) {
    if (!this.initiated) {
      return
    }
    this.initiated = false

    e.preventDefault()
    e.stopPropagation()

    this.moveEventRegister.destroy()

    // TODO 处理 snap 相关逻辑
    // const snapOption = this.scroller.options.snap
    // if (snapOption) {
    //   let {speed, easing = ease.bounce} = snapOption
    //   let snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y)

    //   let time = speed || Math.max(
    //       Math.max(
    //         Math.min(Math.abs(this.scroller.x - snap.x), 1000),
    //         Math.min(Math.abs(this.scroller.y - snap.y), 1000)
    //       ), 300)

    //   if (this.scroller.x !== snap.x || this.scroller.y !== snap.y) {
    //     this.scroller.directionX = 0
    //     this.scroller.directionY = 0
    //     this.scroller.currentPage = snap
    //     this.scroller.scrollTo(snap.x, snap.y, time, easing)
    //   }
    // }
    this.hooks.trigger('touchEnd', this.moved)
  }

  public destroy() {
    this.startEventRegister.destroy()
    this.moveEventRegister && this.moveEventRegister.destroy()
    this.endEventRegister.destroy()
  }
}
