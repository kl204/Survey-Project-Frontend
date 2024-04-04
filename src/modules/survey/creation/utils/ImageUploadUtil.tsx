import axios from 'axios';
import customAxios from '../../../login/components/customApi';

/**
 * 백엔드 서버로부터 S3에 해당 파일이름으로 PreSigned URL을 받아오는 메서드 입니다.
 *
 * @param fileName 업로드할 파일 이름
 * @returns S3로 부터 미리 검증된 PreSigned URL
 */
async function getPreSignedUrl(fileName: string): Promise<string> {
  try {
    const result = await customAxios.get(
      `${process.env.REACT_APP_BASE_URL}/api/images/presigned-url?fileName=${fileName}`
    );
    return result.data.content;
  } catch (error) {
    console.error('Error getting pre-signed URL:', error);
    throw error;
  }
}

/**
 * PreSigned URL의 Query Param 을 지우는 메서드입니다.
 * 해당 메서드를 통해 이미지가 성공적으로 업로드 되었을경우 S3에 저장된 이미지 URL을 얻습니다.
 *
 * @param preSignedUrl S3에 성공적으로 저장한 후의 PreSigned URL
 * @returns S3에 저장된 파일을 URL
 */
function getPureUrlWithOutQueryParam(preSignedUrl: string): string {
  const urlObject = new URL(preSignedUrl);
  urlObject.search = '';

  return urlObject.toString();
}

/**
 * 파일의 크기(10MB), 파일 타입(jpeg, jpg, png)를 검증하는 메서드 입니다.
 *
 * @param file 업로드할 파일
 * @returns 성공 ture, 실패 false
 */
function validationFileCheck(file: File) {
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedFileTypes.includes(file.type)) {
    console.error('Invalid file type. Please upload a JPEG or PNG image.');
    return false;
  }

  const maxSizeInBytes = 10 * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    console.error(
      'File size exceeds the limit. Please upload a file smaller than 10MB.'
    );
    return false;
  }

  return true;
}

/**
 * S3서버로 이미지 파일을 업로드를 담당하는 비즈니스 로직을 정의한 메서드 입니다.
 * 실패할 경우 undefined를 반환하여 다른 메서드에 해당 undefined를 처리하게 했습니다.
 *
 * @param file
 * @returns
 */
export async function imageUploadToS3(file: File): Promise<string | undefined> {
  if (!validationFileCheck(file)) {
    throw new Error('Invalid file. Upload canceled.');
  }

  try {
    const preSignedUrl = await getPreSignedUrl(file.name);

    const axiosForS3 = axios.create({
      headers: {
        Accept: 'application/json',
        Authorization: undefined,
        'Content-Type': file.type,
      },
    });

    await axiosForS3.put(preSignedUrl, file);

    return getPureUrlWithOutQueryParam(preSignedUrl);
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    throw new Error('Image upload failed.');
  }
}
