export interface SliderConfig {
  dots: boolean
  fade: boolean
  speed: number
  autoplaySpeed: number
  slidesToShow: number
  slidesToScroll: number
  lazyLoad: boolean
  pauseOnHover: boolean
  centerMode: boolean
  infinite: boolean
  autoplay: boolean
  arrows: {
    mobile: boolean
    tablet: boolean
    desktop: boolean
  }
  responsive?: {
    breakpoint: number
    settings: Partial<SliderConfig>
  }[]
}

export interface Slide {
  id: string
  slides: SlideItem[] | []
  config: SliderConfig
  isDevMode?: boolean
}

export interface SlideItem {
  id: string
  name: string | null
  locale: string
  imageSrc: string
  slideHref: string | null
  order: number
  isActive: boolean
  display: {
    mobile: boolean
    tablet: boolean
    desktop: boolean
  }
}
