import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export default class SelectionValidation {
  @IsNotEmpty({ message: '설문 문항 ID는 필수 입력사항입니다.' })
  @IsNumber({}, { message: '설문 문항 ID는 숫자여야 합니다.' })
  questionId: number;

  @IsNotEmpty({ message: '선택지 ID는 필수 입력사항입니다.' })
  @IsNumber({}, { message: '선택지 ID는 숫자여야 합니다.' })
  selectionId: number;

  @IsOptional()
  questionMoveId?: number;

  @IsNotEmpty({ message: '선택지 내용은 필수 입력사항입니다.' })
  @IsString({ message: '선택지 내용은 문자열 입니다.' })
  selectionValue: string;

  @IsNotEmpty({ message: '선택지 이동여부는 필수 입력사항입니다.' })
  @IsBoolean({ message: '선택지 이동여부는 boolean 타입이어야 합니다.' })
  isMoveable: boolean;

  @IsNotEmpty({ message: '종료 여부는 필수 입력사항 입니다.' })
  @IsBoolean({ message: '종료 여부는 boolean 타입이어야 합니다.' })
  isEndOfSurvey: boolean;

  constructor(
    questionId: number,
    selectionId: number,
    selectionValue: string,
    isMoveable: boolean,
    isEndOfSurvey: boolean,
    questionMoveId?: number
  ) {
    this.questionId = questionId;
    this.selectionId = selectionId;
    this.selectionValue = selectionValue;
    this.isMoveable = isMoveable;
    this.isEndOfSurvey = isEndOfSurvey;
    this.questionMoveId = questionMoveId;
  }
}
