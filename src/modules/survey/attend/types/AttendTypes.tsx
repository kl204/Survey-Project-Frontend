/**
 * 설문 문항에 대한 정보를 나타내는 인터페이스입니다.
 *
 * @interface
 * @property {string} surveyTitle 설문의 제목입니다.
 * @property {string} surveyImage 설문의 이미지 URL입니다.
 * @property {number} surveyQuestionNo 문항의 고유 번호입니다.
 * @property {string} surveyNo 설문의 고유 번호입니다.
 * @property {number} questionTypeNo 문항의 유형 번호입니다.
 * @property {string} surveyQuestionTitle 문항의 제목입니다.
 * @property {string} surveyQuestionDescription 문항의 설명입니다.
 * @property {number} selectionNo 선택 항목의 고유 번호입니다.
 * @property {number} surveyQuestionMoveNo 다음 문항으로 이동할 번호입니다.
 * @property {string | null} selectionValue 선택 항목의 실제 값입니다.
 * @property {boolean} required 문항 응답이 필수인지 여부입니다.
 * @property {boolean} endOfSurvey 설문이 종료되는지 여부입니다.
 * @property {boolean} movable 문항 선택 후 다른 문항으로 이동 가능한지 여부입니다.
 *
 * @author 박창우
 */
export interface SurveyItem {
  surveyTitle: string;
  surveyImage: string;
  surveyQuestionNo: number;
  surveyNo: string;
  questionTypeNo: number;
  surveyQuestionTitle: string;
  surveyQuestionDescription: string;
  selectionNo: number;
  surveyQuestionMoveNo: number;
  selectionValue: string | null;
  required: boolean;
  endOfSurvey: boolean;
  movable: boolean;
}

/**
 * 설문 데이터 응답에 대한 정보를 나타내는 인터페이스입니다.
 *
 * @interface
 * @property {boolean} success 요청 성공 여부입니다.
 * @property {SurveyItem[]} content 설문 데이터의 배열입니다.
 * @property {unknown} errorResponse 에러 응답 데이터입니다.
 *
 * @author 박창우
 */
export interface SurveyData {
  success: boolean;
  content: SurveyItem[];
  errorResponse: unknown;
}
