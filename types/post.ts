export interface Post {
  content: string;
  imgFiles: File[];
  user: string;
  user_id: string;
}

export const initialPostData: Post = {
  content: '',
  imgFiles: [],
  user: '',
  user_id: '',
};

