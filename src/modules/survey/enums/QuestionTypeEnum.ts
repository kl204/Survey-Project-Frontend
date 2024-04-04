/**
 * 문항의 타입을 나타내는 enum 입니다.
 * https://github.com/typescript-eslint/typescript-eslint/issues/2483
 * https://github.com/typescript-eslint/typescript-eslint/issues/2552
 * 위의 이슈와 동일한 상황이 발생하였기에 eslint 규칙을 no-shadow 규칙을 disable 하였습니다.
 *
 * @author 강명관
 */
// eslint-disable-next-line no-shadow
export const enum QuestionTypeEnum {
  SINGLE_QUESTION = '1',
  MOVEABLE_QUESTION = '2',
  MULTIPLE_QUESTION = '3',
  SHORT_ANSWER = '4',
  SUBJECTIVE_DESCRIPTIVE_ANSWER = '5',
}
