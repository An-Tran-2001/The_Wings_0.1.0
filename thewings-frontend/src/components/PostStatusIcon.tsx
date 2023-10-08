import { PostStatus } from "constant/enum";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import GroupIcon from "@mui/icons-material/Group";

interface PostStatusIconProps {
    status: PostStatus | undefined;
    }

const PostStatusIcon = (props: PostStatusIconProps) => {
    const { status } = props;
  return (
    <div className="ml-2">
      {status === PostStatus.PUBLIC ? (
        <PublicIcon fontSize="15px" />
      ) : status === PostStatus.PRIVATE_ONLY ? (
        <LockIcon fontSize="15px" />
      ) : (
        <GroupIcon fontSize="15px" />
      )}
    </div>
  );
};
export default PostStatusIcon;