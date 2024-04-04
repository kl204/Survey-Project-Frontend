import { SNSSharingParams } from './SNSSharingType';

/**
 * Kakao 선언을 위해 정의하였습니다.
 *
 * @author 강명관
 */
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
  }
}

const windowOpenTargetOptions = {
  blank: '_blank',
  parent: '_parent',
  self: '_self',
  top: '_top',
};

/**
 * 새로운 윈도우 창을 뛰어주는 메서드 입니다.
 *
 * @param snsUrl 새로운 윈도우 창 URL
 * @author 강명관
 */
const openWindow = (snsUrl: string) => {
  window.open(snsUrl, windowOpenTargetOptions.blank || '_blank');
};

/**
 * 트위터 공유하기 입니다.
 *
 * @param {@see SNSSharingParams} 공유하기 제목과 URL 입니다.
 * @author 강명관
 */
const shareToTwitter = ({ shareTitle, shareUrl }: SNSSharingParams) => {
  const sharedLink = `text=${encodeURIComponent(
    `${shareTitle} \n `
  )}${encodeURIComponent(shareUrl)}`;

  openWindow(`https://twitter.com/intent/tweet?${sharedLink}`);
};

/**
 * 페이스북 공유하기 입니다.
 *
 * @param {@see SNSSharingParams} 공유하기 제목과 URL 입니다.
 * @author 강명관
 */
const shareToFacebook = ({ shareUrl }: SNSSharingParams) => {
  const sharedLink = encodeURIComponent(shareUrl);
  openWindow(`http://www.facebook.com/sharer/sharer.php?u=${sharedLink}`);
};

/**
 * 카카오톡 공유하기 입니다.
 *
 * @param {@see SNSSharingParams} 공유하기 제목과 URL 입니다.
 * @author 강명관
 */
const shareToKakaoTalk = ({
  shareTitle,
  shareUrl,
  shareImageUrl,
}: SNSSharingParams) => {
  if (window.Kakao === undefined) {
    return;
  }

  const kakao = window.Kakao;

  if (!kakao.isInitialized()) {
    kakao.init(process.env.REACT_APP_KAKAO_API_KEY);
  }

  kakao?.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: shareTitle,
      imageUrl: shareImageUrl,
      link: {
        mobileWebUrl: shareUrl,
        webUrl: shareUrl,
      },
    },
  });
};

/**
 * 네이버 공유하기 입니다.
 *
 * @param {@see SNSSharingParams} 공유하기 제목과 URL 입니다.
 * @author 강명관
 */
const shareToNaver = ({ shareTitle, shareUrl }: SNSSharingParams) => {
  const url = encodeURI(encodeURIComponent(shareUrl));
  const title = encodeURI(shareTitle);
  const shareURL = `https://share.naver.com/web/shareView?url=${url}&title=${title}`;
  openWindow(shareURL);
};

/**
 * 모바일 자체 공유하기 기능을 이용한 공유하기 입니다.
 *
 * @param {@see SNSSharingParams} 공유하기 제목과 URL 입니다.
 * @author 강명관
 */
const shareToNavigator = ({ shareTitle, shareUrl }: SNSSharingParams) => {
  const sharedData: ShareData = {
    title: shareTitle,
    url: shareUrl,
  };

  try {
    if (navigator.canShare && navigator.canShare(sharedData)) {
      navigator.share(sharedData);
    }
  } catch (e) {
    console.error(e);
  }
};

const isAvailNavigator = typeof navigator.share !== 'undefined';

/**
 * 위에 정의된 각종 공유하기 기능을 hook으로 만들었습니다.
 *
 * @param {@see SNSSharingParams} 공유하기 제목과 URL 입니다.
 * @author 강명관
 */
const useSNSShare = ({
  shareTitle,
  shareUrl,
  shareImageUrl,
}: SNSSharingParams) => ({
  isAvailNavigator,
  shareToTwitter: () => shareToTwitter({ shareTitle, shareUrl, shareImageUrl }),
  shareToFacebook: () =>
    shareToFacebook({ shareTitle, shareUrl, shareImageUrl }),
  shareToKakaoTalk: () =>
    shareToKakaoTalk({ shareTitle, shareUrl, shareImageUrl }),
  shareToNaver: () => shareToNaver({ shareTitle, shareUrl, shareImageUrl }),
  shareToNavigator: () =>
    shareToNavigator({ shareTitle, shareUrl, shareImageUrl }),
});

export default useSNSShare;
