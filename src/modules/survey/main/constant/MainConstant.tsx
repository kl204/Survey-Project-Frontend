import { SwiperOptions } from 'swiper/types/swiper-options';

export const SURVEY_STATUS_PROGRESS = '진행';
export const SURVEY_STATUS_DEADLINE = '마감';

export const tagColor = (tagName: string) => {
  switch (tagName) {
    case '공지':
      return '#F8E5E5';
    case '중요':
      return '#F5F9DE';
    case '업무':
      return '#F9ECDF';
    case '기타':
      return '#E5ECF5';
    case '일상':
      return '#EDEBF6';
    default:
      return 'default';
  }
};

export const swiperParams: SwiperOptions = {
  slidesPerView: 'auto',
  breakpoints: {
    920: {
      slidesPerView: 4,
      spaceBetween: 10,
    },
    750: {
      slidesPerView: 4,
      spaceBetween: 3,
    },

    540: {
      slidesPerView: 3,
      spaceBetween: 3,
    },

    500: {
      slidesPerView: 2,
      spaceBetween: 3,
    },

    0: {
      slidesPerView: 1.9,
      spaceBetween: 15,
    },
  },
};
