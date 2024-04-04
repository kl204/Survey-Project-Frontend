import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { SelectionProps } from '../types/SurveyTypes';

export default class QuestionValidation {
  @IsNotEmpty({ message: '설문 ID는 필수 입력사항입니다.' })
  @IsNumber({}, { message: '설문 ID는 숫자여야 합니다.' })
  surveyId: number;

  @IsNotEmpty({ message: '문항 ID는 필수 입력사항입니다.' })
  @IsNumber({}, { message: '문항 ID는 숫자여야 합니다.' })
  questionId: number;

  @IsNotEmpty({ message: '문항 제목은 필수 입력사항입니다.' })
  @IsString({ message: '문항 제목은 문자열이어야 합니다.' })
  @MaxLength(255, { message: '설문 제목은 최대 255자까지 입력 가능합니다.' })
  questionTitle: string;

  @IsString({ message: '문항 설명은 문자열이어야 합니다.' })
  questionDescription?: string;

  @IsNotEmpty({ message: '문항 필수 여부는 필수 입력사항입니다.' })
  @IsBoolean({ message: '문항 필수 여부는 Boolean 입니다.' })
  questionRequired: boolean;

  @IsNotEmpty({ message: '문항 타입은 필수 입력사항입니다.' })
  @IsString({ message: '문항 타입은 문자열이어야 합니다.' })
  questionType: string;

  @ValidateIf((object) => ['1', '2', '3'].includes(object.questionType))
  @IsArray({ message: '선택지는 배열 형식이어야 합니다.' })
  @ArrayMinSize(1, { message: '선택지는 최소 1개 이상이어야 합니다.' })
  selections: SelectionProps[];

  constructor(
    surveyId: number,
    questionId: number,
    questionTitle: string,
    questionRequired: boolean,
    questionType: string,
    selections: SelectionProps[],
    questionDescription?: string
  ) {
    this.surveyId = surveyId;
    this.questionId = questionId;
    this.questionTitle = questionTitle;
    this.questionRequired = questionRequired;
    this.questionType = questionType;
    this.selections = selections;
    this.questionDescription = questionDescription;
  }
}
