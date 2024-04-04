import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export default class SurveyInfoValidation {
  @IsNotEmpty({ message: '설문 ID는 필수 입력사항입니다.' })
  @IsNumber({}, { message: '설문 ID는 숫자여야 합니다.' })
  surveyId: number;

  @IsNotEmpty({ message: '설문 정보 ID는 필수 입력사항입니다.' })
  @IsNumber({}, { message: '설문 정보 ID는 숫자여야 합니다.' })
  surveyInfoId: number;

  @IsNotEmpty({ message: '설문 제목은 필수 입력사항입니다.' })
  @IsString({ message: '설문 제목은 문자열이어야 합니다.' })
  @MaxLength(255, { message: '설문 제목은 최대 255자까지 입력 가능합니다.' })
  surveyTitle: string;

  @IsArray({ message: '설문 태그는 배열이어야 합니다.' })
  @ArrayMinSize(1, { message: '최소 1개의 태그를 선택해야 합니다.' })
  @ArrayMaxSize(2, { message: '최대 2개의 태그를 선택할 수 있습니다.' })
  surveyTags: string[];

  @IsNotEmpty({ message: '설문 종료일은 필수 입력사항입니다.' })
  @IsString({ message: '설문 종료일은 문자열이어야 합니다.' })
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: '해당 날짜 형식은 yyyy-mm-dd 이어야 합니다.',
  })
  surveyClosingAt: string;

  @IsNotEmpty({ message: '공개 상태 번호는 필수 입력사항입니다.' })
  @IsNumber({}, { message: '공개 상태 번호는 숫자여야 합니다.' })
  openStatusNo: number;

  @IsNotEmpty({ message: '설문 설명은 필수 입력사항입니다.' })
  @IsString({ message: '설문 설명은 문자열이어야 합니다.' })
  surveyDescription: string;

  @IsNotEmpty({ message: '설문 상태 번호는 필수 입력사항입니다.' })
  @IsNumber({}, { message: '설문 상태 번호는 숫자여야 합니다.' })
  surveyStatusNo: number;

  @IsOptional()
  @IsString({ message: '설문 게시일은 문자열이어야 합니다.' })
  @IsDate({ message: '올바른 날짜 형식이어야 합니다.' })
  surveyPostAt?: string;

  constructor(
    surveyId: number,
    surveyInfoId: number,
    surveyClosingAt: string,
    surveyTitle: string,
    surveyTags: string[],
    openStatusNo: number,
    surveyDescription: string,
    surveyStatusNo: number
  ) {
    this.surveyId = surveyId;
    this.surveyInfoId = surveyInfoId;
    this.surveyClosingAt = surveyClosingAt;
    this.surveyTitle = surveyTitle;
    this.surveyTags = surveyTags;
    this.openStatusNo = openStatusNo;
    this.surveyDescription = surveyDescription;
    this.surveyStatusNo = surveyStatusNo;
  }
}
