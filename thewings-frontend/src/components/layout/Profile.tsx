import { Avatar, Stack } from "@mui/material";
import CreatePost from "components/post/CreatePost";
import Post from "components/post/Post";
import Image from "next/image";
import { User, changeProfileInfo, useAuth } from "store/auth";
import FlipCameraIosIcon from "@mui/icons-material/FlipCameraIos";
import Link from "next/link";
import Button from "components/Button";
import { MESSAGE_PATH } from "constant/path";
import { memo, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Sex } from "constant/enum";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import useFriend from "store/friend/selector";
import Face5Icon from "@mui/icons-material/Face5";
import CardImage from "components/CardImage";
import { Pic } from "store/mypics/reducer";

export interface Ionic {
  users_info: User;
  onSubmit?: () => void;
  review_pics?: Pic[];
}

export const FlipCameraIosIconCustom = () => {
  return (
    <div className="w-full h-full flex items-center justify-center absolute inset-0 opacity-0 bg-black/70 z-10 cursor-pointer hover:opacity-100">
      <FlipCameraIosIcon sx={{ color: "white", width: 40, height: 40 }} />
    </div>
  );
};

const Profile = (props: Ionic) => {
  const [openChangInfo, setOpenChangeInfo] = useState(false);

  const handleClickOpenChangeInfo = () => {
    setOpenChangeInfo(true);
  };

  const handleCloseChangeInfo = async () => {
    try {
      await onChangeProfile(info);
      setOpenChangeInfo(false);
    } catch (err) {
      console.log(err);
    }
  };
  const { user, onChangeProfile } = useAuth();
  const { onAddFriend, onRemoveFriend, onAcceptRequest } = useFriend();
  const { users_info, onSubmit, review_pics } = props;
  const [info, setInfo] = useState<changeProfileInfo>(INITIAL_VALUES_PROFILE);
  const [ImageCoverPreview, setImageCoverPreview] = useState(null);
  const [ImageAvatarPreview, setImageAvatarPreview] = useState(null);
  console.log(review_pics);
  const handleImageCoverChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setInfo((prev) => ({ ...prev, cover_image: file }));
      const previewURL = URL.createObjectURL(file);
      setImageCoverPreview(previewURL);
    }
  };
  const handleImageAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setInfo((prev) => ({ ...prev, avatar: file }));
      const previewURL = URL.createObjectURL(file);
      setImageAvatarPreview(previewURL);
    }
  };

  const onSubmitAddfriend = async () => {
    try {
      await onAddFriend({ friend: users_info?.id });
    } catch (err) {
      console.log(err);
    }
  }

  const onSubmitRemoveFriend = async () => {
    try {
      await onRemoveFriend(users_info?.username);
    } catch (err) {
      console.log(err);
    }
  }

  const onSubmitAcceptRequest = async () => {
    try {
      await onAcceptRequest({ friend_id: users_info?.id });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const chageProfile = async (info: changeProfileInfo) => {
      await onChangeProfile(info);
    };
    chageProfile(info);
  }, [onChangeProfile, info.avatar, info.cover_image]);
  return (
    <div className="flex justify-center items-center">
      <div className="container">
        <Stack>
          <div className="relative h-96 bg-transparent rounded m-3">
            {user?.id === users_info?.id ? (
              users_info?.cover_image ? (
                <div>
                  <input
                    type="file"
                    multiple
                    id="upload-cover-avatar"
                    style={{ position: "absolute", top: "-9999px" }}
                    onChange={handleImageCoverChange}
                  />
                  <label htmlFor="upload-cover-avatar">
                    <Image
                      src={
                        ImageCoverPreview
                          ? ImageCoverPreview
                          : "http://localhost:8000" + users_info?.cover_image
                      }
                      alt="cover image"
                      width={100}
                      height={100}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <FlipCameraIosIconCustom />
                  </label>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    id="upload-cover-avatar"
                    style={{ position: "absolute", top: "-9999px" }}
                    onChange={handleImageCoverChange}
                  />
                  <label htmlFor="upload-cover-avatar">
                    {ImageCoverPreview ? (
                      <>
                        <Image
                          src={ImageCoverPreview}
                          alt="cover image"
                          width={100}
                          height={100}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <FlipCameraIosIconCustom />
                      </>
                    ) : (
                      <>
                        <FlipCameraIosIconCustom />
                      </>
                    )}
                  </label>
                </div>
              )
            ) : users_info?.cover_image ? (
              <Image
                src={"http://localhost:8000" + users_info?.cover_image}
                alt="cover image"
                width={100}
                height={100}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <></>
            )}
            <div className="flex items-end absolute translate-y-1/2 translate-x-1/2 bottom-0 left-0 z-10">
              <div className="relative w-[150px] h-[150px] bg-neutral-900 rounded-full outline-black outline-[5px] outline overflow-hidden">
                <input
                  type="file"
                  id="upload-avatar"
                  style={{ position: "absolute", top: "-9999px" }}
                  onChange={handleImageAvatarChange}
                />
                {user?.id === users_info?.id ? (
                  users_info?.avatar ? (
                    <label for="upload-avatar">
                      <Image
                        src={
                          ImageAvatarPreview
                            ? ImageAvatarPreview
                            : "http://localhost:8000" + users_info?.avatar
                        }
                        alt="123"
                        width={300}
                        height={300}
                        style={{
                          objectFit: "cover",
                          borderRadius: "50%",
                          height: "100%",
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center absolute inset-0 opacity-0 bg-black/70 z-10 cursor-pointer hover:opacity-100">
                        <FlipCameraIosIcon
                          sx={{ color: "white", width: 30, height: 30 }}
                        />
                      </div>
                    </label>
                  ) : (
                    <label for="upload-avatar">
                      <Avatar
                        src={ImageAvatarPreview}
                        sx={{ width: 150, height: 150 }}
                        className="absolute inset-0"
                      />
                      <div className="w-full h-full flex items-center justify-center absolute inset-0 opacity-0 bg-black/70 z-10 cursor-pointer hover:opacity-100">
                        <FlipCameraIosIcon
                          sx={{ color: "white", width: 30, height: 30 }}
                        />
                      </div>
                    </label>
                  )
                ) : users_info?.avatar ? (
                  <Image
                    src={"http://localhost:8000" + users_info?.avatar}
                    alt="123"
                    width={300}
                    height={300}
                    style={{
                      objectFit: "cover",
                      borderRadius: "50%",
                      height: "100%",
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{ width: 150, height: 150 }}
                    className="absolute inset-0"
                  />
                )}
                <form>
                  <input type="file" disabled className="hidden" />
                </form>
              </div>
              <h1 className="text-white font-bold text-[20px]">
                {users_info?.name || users_info?.email || "Name"}
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-end h-[100px] border-b-[1px]  border-stone-500">
            <div className="flex ">
              {user?.id === users_info?.id ? (
                <Button
                  content="Edit Profile"
                  onClick={handleClickOpenChangeInfo}
                  icon={<BorderColorIcon />}
                />
              ) : (
                <Stack flexDirection="row" className="space-x-3">
                  {/* <Button content="Message" icon={<MapsUgcIcon />} /> */}
                  {users_info?.isfriend ? (
                    <Button
                      content="Unfriend"
                      icon={<PersonRemoveIcon />}
                      onClick={onSubmitRemoveFriend}
                    />
                  ) : users_info?.send_request ? (
                    <Button
                      content="Cancel Request"
                      icon={<CancelScheduleSendIcon />}
                      onClick={onSubmitRemoveFriend}
                    />
                  ) : users_info.receive_request ? (
                    <Button
                      content="Accept Request"
                      icon={<HowToRegIcon />}
                      onClick={onSubmitAcceptRequest}
                    />
                  ) : (
                    <Button
                      content="Add Friend"
                      icon={<PersonAddIcon />}
                      onClick={onSubmitAddfriend}
                    />
                  )}
                </Stack>
              )}
              <Dialog open={openChangInfo} onClose={handleCloseChangeInfo}>
                <DialogTitle className="text-center">Change Info</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Change your profile information
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="bio"
                    label="Bio"
                    type="email"
                    fullWidth
                    variant="standard"
                    onChange={(e) =>
                      setInfo((prev) => ({ ...prev, bio: e.target.value }))
                    }
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="sex"
                    label="Sex"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e) =>
                      setInfo((prev) => ({
                        ...prev,
                        sex: e.target.value,
                      }))
                    }
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="address"
                    label="Address"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e) =>
                      setInfo((prev) => ({ ...prev, address: e.target.value }))
                    }
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="birthDate"
                    label="Birthday"
                    type="date"
                    fullWidth
                    variant="standard"
                    onChange={(e) =>
                      setInfo((prev) => ({
                        ...prev,
                        birth_date: e.target.value,
                      }))
                    }
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseChangeInfo} content="Cancel" />
                  <Button onClick={handleCloseChangeInfo} content="Change" />
                </DialogActions>
              </Dialog>
            </div>
          </div>
          <div className="border-b-1 border-white grid grid-cols-3 gap-4 mt-4">
            <div className="text-white bg-neutral-900  px-3 py-4 rounded-lg box-border h-fit">
              <h2 className="font-bold text-[1.1rem]">Intro</h2>
              <p className="text-center p-3">
                {(users_info && users_info.bio) || "..."}
              </p>
              <div className="mb-2 text-[0.9rem] flex items-center border-b-4  border-neutral-400"></div>
              <div className="py-2 text-[0.9rem] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="mx-3">Name: {users_info?.name}</p>
              </div>
              <div className="py-2 text-[0.9rem] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
                  />
                </svg>
                <p className="mx-3">Email: {users_info?.email}</p>
              </div>
              <div className="py-2 text-[0.9rem] flex items-center">
                <Face5Icon className="w-6 h-6" />
                <p className="mx-3">Sex: {users_info?.sex || "..."}</p>
              </div>
              <div className="py-2 text-[0.9rem] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z"
                  />
                </svg>
                <p className="mx-3">Brithday: {users_info?.birthday}</p>
              </div>
              <div className="py-2 text-[0.9rem] flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <p className="mx-3">
                  Locations: {users_info?.address || "..."}
                </p>
              </div>
              <Stack>
                <div className="flex justify-between items-center py-3">
                  <h2 className="font-bold text-[1.1rem]">Recent Image</h2>
                  <Link href={MESSAGE_PATH}>
                  See all
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-4 my-3">
                  {
                    review_pics?.map((pic) => (
                      <div className="col-span-1 rounded-xl overflow-hidden" key={pic?.id}>
                        <CardImage
                          src={pic?.file}
                        />
                      </div>
                    ))
                  }
                </div>
              </Stack>
            </div>
            <div className="col-span-2">
              <CreatePost onPosts={onSubmit} />
              <Stack className="justify-center items-center mt-3">
                <Post link_post="post" />
              </Stack>
            </div>
          </div>
        </Stack>
      </div>
    </div>
  );
};

export default memo(Profile);

const INITIAL_VALUES_PROFILE: changeProfileInfo = {
  bio: "",
  sex: Sex.MALE,
  birth_date: "",
  address: "",
  avatar: "",
  cover_image: "",
};
