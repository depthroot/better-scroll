import { hasTransition, hasTransform, hasTouch } from '../util/dom'
import {
  tap,
  bounceOptions,
  pickerOptions,
  slideOptions,
  scrollbarOptions,
  pullDownRefreshOptions,
  pullUpLoadOptions,
  mouseWheelOptions,
  zoomOptions,
  infinityOptions,
  dblclickOptions
} from '../../types/options'

export default class Options {
  [key: string]: any
  startX: number
  startY: number
  scrollX: boolean
  scrollY: boolean
  freeScroll: boolean
  directionLockThreshold: number
  eventPassthrough: string
  click: boolean
  tap: tap
  bounce: bounceOptions
  bounceTime: number
  momentum: boolean
  momentumLimitTime: number
  momentumLimitDistance: number
  swipeTime: number
  swipeBounceTime: number
  deceleration: number
  flickLimitTime: number
  flickLimitDistance: number
  resizePolling: number
  probeType: number
  stopPropagation: boolean
  preventDefault: boolean
  preventDefaultException: {
    tagName?: RegExp
    className?: RegExp
  }
  HWCompositing: boolean
  useTransition: boolean
  useTransform: boolean
  bindToWrapper: boolean
  disableMouse: boolean | ''
  disableTouch: boolean | ''
  observeDOM: boolean
  autoBlur: boolean
  // plugins options
  picker: pickerOptions
  slide: slideOptions
  scrollbar: scrollbarOptions
  pullDownRefresh: pullDownRefreshOptions
  pullUpLoad: pullUpLoadOptions
  mouseWheel: mouseWheelOptions
  zoom: zoomOptions
  infinity: infinityOptions
  dblclick: dblclickOptions

  constructor() {
    this.startX = 0
    this.startY = 0

    this.scrollX = false
    this.scrollY = true
    this.freeScroll = false
    this.directionLockThreshold = 5
    this.eventPassthrough = ''
    this.click = false
    this.tap = ''

    /**
     * support any side
     * bounce: {
     *   top: true,
     *   bottom: true,
     *   left: true,
     *   right: true
     * }
     */
    this.bounce = true
    this.bounceTime = 800

    this.momentum = true
    this.momentumLimitTime = 300
    this.momentumLimitDistance = 15

    this.swipeTime = 2500
    this.swipeBounceTime = 500

    this.deceleration = 0.0015

    this.flickLimitTime = 200
    this.flickLimitDistance = 100

    this.resizePolling = 60
    this.probeType = 0

    this.stopPropagation = false
    this.preventDefault = true
    this.preventDefaultException = {
      tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/
    }

    this.HWCompositing = true

    this.useTransition = true
    this.useTransform = true
    this.bindToWrapper = false
    this.disableMouse = hasTouch
    this.disableTouch = !hasTouch
    this.observeDOM = true
    this.autoBlur = true

    // plugins config

    /**
     * for picker
     * wheel: {
     *   selectedIndex: 0,
     *   rotate: 25,
     *   adjustTime: 400
     *   wheelWrapperClass: 'wheel-scroll',
     *   wheelItemClass: 'wheel-item'
     * }
     */
    this.picker = false

    /**
     * for slide
     * slide: {
     *   loop: false,
     *   el: domEl,
     *   threshold: 0.1,
     *   stepX: 100,
     *   stepY: 100,
     *   speed: 400,
     *   easing: {
     *     style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
     *     fn: function (t) {
     *       return t * (2 - t)
     *     }
     *   }
     *   listenFlick: true
     * }
     */
    this.slide = false

    /**
     * for scrollbar
     * scrollbar: {
     *   fade: true,
     *   interactive: false
     * }
     */
    this.scrollbar = false

    /**
     * for pull down and refresh
     * pullDownRefresh: {
     *   threshold: 50,
     *   stop: 20
     * }
     */
    this.pullDownRefresh = false

    /**
     * for pull up and load
     * pullUpLoad: {
     *   threshold: 50
     * }
     */
    this.pullUpLoad = false

    /**
     * for mouse wheel
     * mouseWheel: {
     *   speed: 20,
     *   invert: false,
     *   easeTime: 300
     * }
     */
    this.mouseWheel = false

    /**
     * for zoom
     * zoom: {
     *   start: 1,
     *   min: 1,
     *   max: 4
     * }
     */
    this.zoom = false

    /**
     * for infinity
     * infinity: {
     *   render(item, div) {
     *   },
     *   createTombstone() {
     *   },
     *   fetch(count) {
     *   }
     * }
     */
    this.infinity = false

    /**
     * for double click
     * dblclick: {
     *   delay: 300
     * }
     */
    this.dblclick = false
  }
  merge(options: { [key: string]: any }) {
    for (let key in options) {
      this[key] = options[key]
    }
    return this
  }
  process() {
    this.useTransition = this.useTransition && hasTransition
    this.useTransform = this.useTransform && hasTransform

    this.preventDefault = !this.eventPassthrough && this.preventDefault

    // If you want eventPassthrough I have to lock one of the axes
    this.scrollX = this.eventPassthrough === 'horizontal' ? false : this.scrollX
    this.scrollY = this.eventPassthrough === 'vertical' ? false : this.scrollY

    // With eventPassthrough we also need lockDirection mechanism
    this.freeScroll = this.freeScroll && !this.eventPassthrough
    this.directionLockThreshold = this.eventPassthrough
      ? 0
      : this.directionLockThreshold

    return this
  }
}
