/**
 * 설문의 공개 상태를 나타내는 enum 입니다.
 * https://github.com/typescript-eslint/typescript-eslint/issues/2483
 * https://github.com/typescript-eslint/typescript-eslint/issues/2552
 * 위의 이슈와 동일한 상황이 발생하였기에 eslint 규칙을 no-shadow 규칙을 disable 하였습니다.
 */
// eslint-disable-next-line no-shadow
export const enum OpenStatusEnum {
  PUBLIC = 1,
  ONLY_USER = 2,
  PRIVATE = 3,
}
