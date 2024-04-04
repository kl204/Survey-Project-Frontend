/** @jsxImportSource @emotion/react */

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ImageIcon from '@mui/icons-material/Image';
import { css } from '@emotion/react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CreateSurveyInfoProps, SurveyInfoProps } from '../types/SurveyTypes';
import { OpenStatusEnum } from '../../enums/OpenStatusEnum';

const styles = {
  card: css({
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);',
    marginBottom: '30px',
  }),

  imageContainer: css({
    marginBottom: '20px',
  }),

  iamgeBox: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px dashed #D1D1D1',
    height: '140px',
    marginBottom: '10px',
  }),

  noImageIcon: css({
    fontSize: '30px',
    color: '#757575',
  }),

  image: css({ width: '100%', height: '100%', objectFit: 'contain' }),

  imageUploadButton: css({
    backgroundColor: '#3e3e3e',
  }),

  uploadImage: css({
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  }),

  surveyTitleBox: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  }),

  surveyDescriptionBox: css({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: '10px',
  }),

  selectQuestionTypeBox: css({
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  }),

  textStyle: css({
    marginRight: '10px',
    fontWeight: 'bold',
    minWidth: '65px',
  }),

  inputStyle: css({
    flexGrow: '1',
  }),

  tagSelectContainer: css({
    marginBottom: '10px',
  }),

  tagSelectBox: css({
    width: '100%',
  }),

  tagChipBox: css({
    display: 'flex',
    flexWrap: 'wrap',
    gap: 0.5,
  }),

  dateInputStyle: css({
    marginTop: '10px',
    minWidth: '100px',
  }),
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const TITLE_MAX_LENGTH = 32;

const tagNames = ['일상', '업무', '공지', '중요', '기타'];

function CreateSurveyInfo({
  surveyInfo,
  setSurveyInfo,
  previewImage,
  setSurveyImage,
}: CreateSurveyInfoProps) {
  const [selectedImage, setSelectedImage] = useState<string>('');

  const today = new Date();
  const oneWeekLater = new Date(today);
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
  const oneWeekLaterFormatted = oneWeekLater.toISOString().split('T')[0];

  useEffect(() => {
    setSurveyInfo((prevSurveyInfo) => ({
      ...prevSurveyInfo,
      surveyClosingAt: oneWeekLaterFormatted,
    }));

    if (previewImage) {
      setSelectedImage(previewImage);
    }
  }, []);

  /**
   * 설문지 제목, 설명, 날짜를 변경하는 메서드 입니다.
   *
   * @param event Input onChange Event
   * @author 강명관
   */
  const handleSurveyInfoInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    const updateSurveyInfo: SurveyInfoProps = {
      ...surveyInfo,
      [name]: value,
    };

    setSurveyInfo(updateSurveyInfo);
  };

  /**
   * 이미지 선택시 호출되는 메서드 입니다.
   *
   * @param event React.ChangeEvent<HTMLInputElement>
   * @author 강명관
   */
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFile = event.target.files && event.target.files[0];
    if (uploadFile) {
      const imageUrl: string = URL.createObjectURL(uploadFile);

      setSurveyImage(uploadFile);
      setSelectedImage(imageUrl);
    } else {
      setSurveyImage(undefined);
      setSelectedImage('');
    }
  };

  /**
   * 태그가 선택시 호출되는 메서드 입니다.
   *
   * @param event SelectChangeEvent<typeof tagNames>
   * @author 강명관
   */
  const handleTagChange = (event: SelectChangeEvent<typeof tagNames>) => {
    const tagValue = event.target.value;

    const tagValueArray: string[] = Array.isArray(tagValue)
      ? tagValue
      : [tagValue];

    const maxTagCount: number = 2;

    const selectedCount = tagValueArray.length;

    if (selectedCount > maxTagCount) {
      const limitedSelection = tagValueArray.slice(0, maxTagCount);
      setSurveyInfo({
        ...surveyInfo,
        surveyTags: limitedSelection,
      });
    } else {
      setSurveyInfo({
        ...surveyInfo,
        surveyTags: tagValueArray,
      });
    }
  };

  /**
   * 설문의 공개 상태를 변경하는 메서드 입니다.
   *
   * @param event SelectChangeEvent
   * @author 강명관
   */
  const handleOpenStatusChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;

    const updateSurveyInfo: SurveyInfoProps = {
      ...surveyInfo,
      [name]: value,
    };

    setSurveyInfo(updateSurveyInfo);
  };

  const surveyTitle = (
    <Box css={styles.surveyTitleBox}>
      <Typography css={styles.textStyle}>설문 제목</Typography>
      <Input
        placeholder="설문 제목을 입력해주세요."
        css={styles.inputStyle}
        name="surveyTitle"
        value={surveyInfo.surveyTitle}
        onChange={handleSurveyInfoInputChange}
        inputProps={{ maxLength: TITLE_MAX_LENGTH }}
      />
    </Box>
  );

  const surveyTagSelectBox = (
    <div css={styles.tagSelectContainer}>
      <FormControl css={styles.tagSelectBox}>
        <InputLabel id="demo-multiple-chip-label">태그</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={surveyInfo.surveyTags}
          onChange={handleTagChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selectedValue) => (
            <Box css={styles.tagChipBox}>
              {selectedValue.map((value: unknown) => (
                <Chip
                  key={tagNames[value as number]}
                  label={tagNames[value as number]}
                />
              ))}
            </Box>
          )}
        >
          {tagNames.map((tag, index) => (
            <MenuItem key={tag} value={index}>
              {tag}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );

  const surveyDescription = (
    <Box css={styles.surveyDescriptionBox}>
      <Typography css={styles.textStyle}>설문 설명</Typography>
      <Input
        placeholder="문항 설명을 입력해주세요."
        css={styles.inputStyle}
        name="surveyDescription"
        value={surveyInfo.surveyDescription}
        onChange={handleSurveyInfoInputChange}
      />
    </Box>
  );

  const surveyOpenStatusSelectBox = (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="openStatus-select-label">설문결과 공개</InputLabel>
        <Select
          labelId="openStatus-select-label"
          id="openStatus-select"
          value={surveyInfo.openStatusNo.toString()}
          name="openStatusNo"
          label="설문결과 공개"
          onChange={handleOpenStatusChange}
        >
          <MenuItem value={OpenStatusEnum.PUBLIC}>전체공개</MenuItem>
          <MenuItem value={OpenStatusEnum.ONLY_USER}>회원공개</MenuItem>
          <MenuItem value={OpenStatusEnum.PRIVATE}>비공개</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <Card css={styles.card}>
      <CardContent>
        {surveyTitle}

        <Box css={styles.imageContainer}>
          {!selectedImage && (
            <Box css={styles.iamgeBox}>
              <ImageIcon css={styles.noImageIcon} />
            </Box>
          )}
          {selectedImage && (
            <div>
              <Box css={styles.iamgeBox}>
                <img
                  src={selectedImage}
                  alt="설문 이미지"
                  css={styles.uploadImage}
                  id="surveyImage"
                />
              </Box>
            </div>
          )}
          <Box>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              css={styles.imageUploadButton}
            >
              Upload file
              <VisuallyHiddenInput type="file" onChange={handleImageUpload} />
            </Button>
          </Box>
        </Box>

        {surveyTagSelectBox}

        <Box
          sx={{
            marginBottom: '10px',
          }}
        >
          <Typography css={styles.textStyle}>설문조사 마감일 지정</Typography>

          <TextField
            id="date"
            label="마감일"
            type="date"
            name="surveyClosingAt"
            value={surveyInfo.surveyClosingAt}
            inputProps={{
              min: tomorrowFormatted,
            }}
            css={styles.dateInputStyle}
            onChange={handleSurveyInfoInputChange}
          />
        </Box>

        {surveyOpenStatusSelectBox}
        {surveyDescription}
      </CardContent>
    </Card>
  );
}

export default CreateSurveyInfo;
