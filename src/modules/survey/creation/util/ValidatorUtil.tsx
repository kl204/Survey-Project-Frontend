import { validate, ValidationError } from 'class-validator';
import Swal from 'sweetalert2';
import { QuestionTypeEnum } from '../../enums/QuestionTypeEnum';
import {
  QuestionProps,
  SelectionProps,
  SurveyInfoProps,
} from '../types/SurveyTypes';
import QuestionValidation from '../validator/QuestionValidation';
import SurveyInfoValidation from '../validator/SurveyInfoValidation';

/**
 * class-Validator 를 이용한 validation 처리에서
 * 메세지 속성값 만을 가져오기 위한 공통 처리 메서드입니다.
 * 따라서 해당 타입의 경우 여러 클래스가 들어올 수 있도록 any 타입을 사용하였고,
 * 그에 따라 eslint 규칙을 disable 하였습니다.
 *
 * @param validationClass class-Validator 클래스
 * @param validationErrors validate를 진행하고 나온 에러들
 * @returns class-Validator 에 지정해둔 message value string[]
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getValidationErrorMessage<T extends Record<string, any>>(
  validationClass: T,
  validationErrors: ValidationError[]
): string[] {
  const validationCalssField = Object.keys(validationClass);

  const errorMessages: string[] = validationErrors
    .filter((error) => validationCalssField.includes(error.property))
    .map((error) => {
      if (error.constraints) {
        return Object.values(error.constraints).join('\n');
      }
      return '';
    });

  return errorMessages;
}

/**
 * 설문의 대표이미지에 대해서 파일 형식을 체크하는 메서드 입니다.
 * JPEG, JPG, PNG 형식의 파일만 가능하게 설정되어 있습니다.
 *
 * @param fileName 파일의 이름
 * @returns 성공 true, 실패 false
 */
const validationFileExtension = (fileName: string) => {
  const allowedExtensions = ['jpeg', 'jpg', 'png'];

  const lastIndex = fileName.lastIndexOf('.');

  if (lastIndex === -1 || lastIndex === fileName.length - 1) {
    return false;
  }

  const fileExtension = fileName.slice(lastIndex + 1).toLowerCase();

  return allowedExtensions.includes(fileExtension);
};

/**
 * 파일 사이즈(최대 10MB)를 검증하는 메서드 입니다.
 *
 * @param file 업로드할 파일
 * @returns 성공 ture, 실패 false
 */
const validationFileSize = (file: File) => {
  const maxSizeInBytes = 10 * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return false;
  }

  return true;
};

/**
 * 설문의 이미지 존재 여부를 검증하는 메서드 입니다.
 *
 * @param surveyImage File 타입의 이미지 파일
 * @returns 성공 true, 실패 false
 */
const validationSurveyImage = (surveyImage: File | undefined) => {
  if (surveyImage === undefined || surveyImage === null) {
    return false;
  }

  return true;
};

/**
 * 설문에 대한 기본 정보를 Validation 체크하기 위한 메서드 입니다.
 *
 * @returns validation error가 존재할 경우 false, 성공 true
 * @author 강명관
 */
const validationSurveyInfo = async (
  surveyInfo: SurveyInfoProps
): Promise<boolean> => {
  let surveyInfoValidationCheck: boolean = true;

  const surveyInfoValidation: SurveyInfoValidation = new SurveyInfoValidation(
    surveyInfo.surveyId,
    surveyInfo.surveyInfoId,
    surveyInfo.surveyClosingAt,
    surveyInfo.surveyTitle,
    surveyInfo.surveyTags,
    surveyInfo.openStatusNo,
    surveyInfo.surveyDescription,
    surveyInfo.surveyStatusNo
  );

  const surveyInfoErrors = await validate(surveyInfoValidation);

  if (surveyInfoErrors.length > 0) {
    const errorMessage = getValidationErrorMessage(
      surveyInfoValidation,
      surveyInfoErrors
    );
    Swal.fire({
      icon: 'error',
      title: '입력되지 않은 사항이 존재합니다.',
      text: `${errorMessage}`,
    });
    surveyInfoValidationCheck = false;
    return surveyInfoValidationCheck;
  }

  return surveyInfoValidationCheck;
};

/**
 * 일반문항(단일 선택형, 다중 선택형)의 선택지에 대해서 Validation 하기 위한 메서드 입니다.
 *
 * @param question 문항의 유형이 선택형인 문항
 * @returns validation error가 존재할 경우 false, 성공 true
 * @author 강명관
 */
const validationGeneralSelection = (selections: SelectionProps[]) => {
  if (selections.length < 1) {
    Swal.fire({
      icon: 'error',
      title: '선택지는 최소 한개 이상 존재해야 합니다.',
    });
    return false;
  }

  return selections.every((selection) => {
    if (!selection.selectionValue) {
      return false;
    }

    if (selection.isEndOfSurvey || selection.isMoveable) {
      return false;
    }

    return true;
  });
};

/**
 * 이동형 문항에 대한 Validation을 진행하는 메서드 입니다.
 * 이동 사항이 설문 종료일 경우 questionMoveId 는 존재하면 안되고,
 * 이동 사항이 문항일 경우 해당 문항이 제대로 매핑되었는지 확인하는 메서드 입니다.
 *
 * @param selections 문항 선택시 이동 문항의 선택지들
 * @returns validation error가 존재할 경우 false, 성공 true
 * @author 강명관
 */
const validationMoveableSelection = (selections: SelectionProps[]): boolean =>
  selections.every((selection) => {
    if (!selection.isMoveable || !selection.selectionValue) {
      Swal.fire({
        icon: 'error',
        title: '선택지 정보가 잘못되었습니다.',
        text: '선택지 정보가 잘못되었습니다. 다시 시도해 주세요.',
      });
      return false;
    }

    if (
      (!selection.isEndOfSurvey && selection.questionMoveId === undefined) ||
      (selection.isEndOfSurvey && selection.questionMoveId)
    ) {
      Swal.fire({
        icon: 'error',
        title: '입력되지 않은 사항이 존재합니다.',
        text: '선택시 문항 이동에 대한 값이 제대로 입력되지 않았습니다.',
      });
      return false;
    }

    return true;
  });

/**
 * 문항에 대한 validation을 진행하기 위한 메서드 입니다.
 *
 * @param validQuestions validation을 진행한 questions
 * @returns 모든 validation이 통과하면 true
 * @author 강명관
 */
const validationQuestion = async (validQuestions: QuestionProps[]) => {
  if (validQuestions.length < 1) {
    Swal.fire({
      icon: 'error',
      title: '입력되지 않은 사항이 존재합니다.',
      text: `문항의 개수는 최소 1개 이상입니다.`,
    });
    return false;
  }

  const validationResultPromise = validQuestions.map(async (question) => {
    const questionValidation = new QuestionValidation(
      question.surveyId,
      question.questionId,
      question.questionTitle,
      question.questionRequired,
      question.questionType,
      question.selections,
      question.questionDescription
    );

    const questionErrors = await validate(questionValidation);
    if (questionErrors.length > 0) {
      return false;
    }

    return true;
  });

  const validationResults: boolean[] = await Promise.all(
    validationResultPromise
  );

  return validationResults.every(Boolean);
};

/**
 * 모든 선택지(단일 선택형, 선택시 문항 이동형, 다중 선택형)에 대해서 선택지 정보를 검증하기 위한 메서드 입니다.
 *
 * @returns 성공시 true, 실패시 false
 * @author 강명관
 */
const totalSelectionValidation = (validQuestions: QuestionProps[]) => {
  const questionSelectionType = [
    QuestionTypeEnum.SINGLE_QUESTION.toString(),
    QuestionTypeEnum.MOVEABLE_QUESTION.toString(),
    QuestionTypeEnum.MULTIPLE_QUESTION.toString(),
  ];

  const totalSelectionValidationResult = validQuestions
    .filter((question) => questionSelectionType.includes(question.questionType))
    .map((selectionTypeQuestion) => {
      if (
        selectionTypeQuestion.questionType ===
        QuestionTypeEnum.MOVEABLE_QUESTION
      ) {
        return validationMoveableSelection(selectionTypeQuestion.selections);
      }
      return validationGeneralSelection(selectionTypeQuestion.selections);
    });

  return totalSelectionValidationResult.every(Boolean);
};

/**
 * 전체 하나의 설문 (설문 정보, 문항, 선택지)을 검증하기 위한 메서드 입니다.
 *
 * @return 전체 모든 validation이 통과하면 true, 실패할 경우 false
 * @author 강명관
 */
export const validationSurvey = async (
  validSurveyInfo: SurveyInfoProps,
  validSurveyImage: File | undefined,
  validQuestions: QuestionProps[]
): Promise<boolean> => {
  if (!validationSurveyImage(validSurveyImage)) {
    Swal.fire({
      icon: 'error',
      title: '입력되지 않은 사항이 존재합니다.',
      text: `설문의 대표 이미지는 필수 입니다.`,
    });
    return false;
  }

  if (validSurveyImage && !validationFileExtension(validSurveyImage.name)) {
    Swal.fire({
      icon: 'error',
      title: '입력되지 않은 사항이 존재합니다.',
      text: `설문 이미지는 JPG, JPEG, PNG 형식만 가능합니다`,
    });
    return false;
  }

  if (validSurveyImage && !validationFileSize(validSurveyImage)) {
    Swal.fire({
      icon: 'error',
      title: '입력되지 않은 사항이 존재합니다.',
      text: `설문 이미지의 크기는 최대 10MB까지 가능합니다.`,
    });
    return false;
  }

  const [surveyInfoResult, questionResult] = await Promise.all([
    validationSurveyInfo(validSurveyInfo),
    validationQuestion(validQuestions),
  ]);

  const selectionResult = totalSelectionValidation(validQuestions);

  if (!surveyInfoResult) {
    Swal.fire({
      icon: 'error',
      title: '설문 정보가 올바르지 않습니다.',
      text: `설문 작성 정보를 다시 확인해주세요`,
    });
    return false;
  }

  if (!questionResult) {
    Swal.fire({
      icon: 'error',
      title: '문항 정보가 올바르지 않습니다.',
      text: `문항 작성 정보를 다시 확인해주세요`,
    });
    return false;
  }

  if (!selectionResult) {
    Swal.fire({
      icon: 'error',
      title: '선택지 정보가 올바르지 않습니다.',
      text: `선택지 작성 정보를 다시 확인해주세요`,
    });
    return false;
  }

  return true;
};

/**
 * 전체 하나의 설문 (설문 정보, 문항, 선택지)을 검증하기 위한 메서드 입니다.
 *
 * @return 전체 모든 validation이 통과하면 true, 실패할 경우 false
 * @author 강명관
 */
export const validationSurveyWithoutSurveyImage = async (
  validSurveyInfo: SurveyInfoProps,
  validQuestions: QuestionProps[]
): Promise<boolean> => {
  const [surveyInfoResult, questionResult] = await Promise.all([
    validationSurveyInfo(validSurveyInfo),
    validationQuestion(validQuestions),
  ]);

  const selectionResult = totalSelectionValidation(validQuestions);

  if (!surveyInfoResult) {
    Swal.fire({
      icon: 'error',
      title: '설문 정보가 올바르지 않습니다.',
      text: `설문 작성 정보를 다시 확인해주세요`,
    });
    return false;
  }

  if (!questionResult) {
    Swal.fire({
      icon: 'error',
      title: '문항 정보가 올바르지 않습니다.',
      text: `문항 작성 정보를 다시 확인해주세요`,
    });
    return false;
  }

  if (!selectionResult) {
    Swal.fire({
      icon: 'error',
      title: '선택지 정보가 올바르지 않습니다.',
      text: `선택지 작성 정보를 다시 확인해주세요`,
    });
    return false;
  }

  return true;
};
