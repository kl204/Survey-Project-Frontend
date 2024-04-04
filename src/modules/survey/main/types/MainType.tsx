export interface CardDataProps {
  surveyNo: number;
  surveyTitle: string;
  surveyDescription: string;
  surveyImage: string;
  surveyPostAt: string;
  surveyClosingAt: string;
  userNo: number;
  userNickName: string;
  userImage: string;
  attendUserNo: Array<number>;
  surveyStatusName: string;
  openStatusName: string;
  tagName: string[];
  surveyAttendCount: number;
  isDeleted: boolean;
  attendCheckList: boolean[];
}

export interface CardDataListProps {
  cardList: CardDataProps[];
}

export interface DataLoaded {
  handleDataLoaded(): void;
}

export interface ModalProps {
  openModal: boolean;
  closeCardModal(): void;
  selectedCard: CardDataProps;
}

export interface ModalButtonGroupProps {
  numUser(): number | null;
  selectedCard: CardDataProps;
  showSwalAlert(): void;
}
