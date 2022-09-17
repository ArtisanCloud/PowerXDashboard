export interface UserState {
  id?: number;
  account?: string;
  name?: string;
  email?: string;
  mobilePhone?: string;
  gender?: string;
  nickName?: string;
  desc?: string;
  avatar?: string;
  externalEmail?: string;
  depIds?: number[];
  roles?: Array<string>;
  position?: string;
  jobTitle?: string;
  isEnabled?: boolean;
  createdAt?: string;
}
