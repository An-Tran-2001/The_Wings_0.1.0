import { memo } from "react";

export interface IPostProps {
  id: string;
  title: string;
  content: string;
} 

const Post = (props: IPostProps) => {
  const {id, title, content} = props;

  return <div className="flex ">
    {content}
  </div>;
};

export default memo(Post);
