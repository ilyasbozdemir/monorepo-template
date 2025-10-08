import { SwiperProps } from "swiper/react";

export interface SlideV2 {
  id: string;
  className?: string;
  slides: SlideItemV2[];
  config: SwiperProps;
}

export interface SlideItemV2 {
  id: string;
  name: string | null;
  imageSrc: string;
  slideHref: string | null;
  order: number;
  display: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
}

export interface SliderArrow {
  onClick: () => void;
}
