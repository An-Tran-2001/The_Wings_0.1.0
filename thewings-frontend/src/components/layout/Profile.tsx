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

export interface Ionic {
  users_info: User;
  onSubmit?: () => void;
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

  const handleCloseChangeInfo = () => {
    setOpenChangeInfo(false);
  };
  const { user, onChangeProfile } = useAuth();
  const { users_info, onSubmit } = props;
  const [info, setInfo] = useState<changeProfileInfo>(INITIAL_VALUES_PROFILE);
  const [ImageCoverPreview, setImageCoverPreview] = useState(null);
  const [ImageAvatarPreview, setImageAvatarPreview] = useState(null);
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
  }
  useEffect(() => {
    const chageProfile = async (info: changeProfileInfo) => {
      await onChangeProfile(info);
    };
    chageProfile(info);
  }, [onChangeProfile, info]);
  return (
    <div className="flex justify-center items-center">
      <div className="container">
        <header className="">
          <div className="relative h-96 bg-transparent rounded m-3">
            {user?.id === users_info?.id ? (
              users_info?.cover_image ? (
                <div>
                  <input
                    type="file"
                    multiple
                    id="upload-file"
                    style={{ position: "absolute", top: "-9999px" }}
                    onChange={handleImageCoverChange}
                  />
                  <label htmlFor="upload-file">
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
                    id="upload-file"
                    style={{ position: "absolute", top: "-9999px" }}
                    onChange={handleImageCoverChange}
                  />
                  <label htmlFor="upload-file">
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
                    ) : users_info?.cover_image ? (
                      <>
                        <Image
                          src={
                            "http://localhost:8000" + users_info?.cover_image
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
                      </>
                    ) : (
                      <></>
                    )}
                  </label>
                </div>
              )
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
                  className="mx-2"
                  content="Edit Profile"
                  onClick={handleClickOpenChangeInfo}
                />
              ) : (
                <Stack flexDirection="row">
                  <Button className="mx-2" content="Follow" />
                  <Link href={MESSAGE_PATH}>
                    <Button className="mx-2" content="Message" />
                  </Link>
                  <Button className="mx-2" content="Add Friend" />
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
                    id="name"
                    label="User Name"
                    type="text"
                    fullWidth
                    variant="standard"
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="phoneNumber"
                    label="Phone Number"
                    type="text"
                    fullWidth
                    variant="standard"
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="address"
                    label="Address"
                    type="text"
                    fullWidth
                    variant="standard"
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="birthDate"
                    label="Birthday"
                    type="date"
                    fullWidth
                    variant="standard"
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
            <div className="text-white bg-neutral-900  p-3 rounded-lg box-border">
              <h2 className="font-bold text-[1.1rem]">Intro</h2>
              <p className="text-center p-3">Some text</p>
              <Button className="w-full bg-gray-800" content="Edit Bio" />
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
                <p className="mx-3">User name: {users_info?.name}</p>
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
            </div>
            <div className="col-span-2">
              <CreatePost onPosts={onSubmit} />
              <Stack className="justify-center items-center mt-3">
                <Post link_post="post" />
              </Stack>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default memo(Profile);

const INITIAL_VALUES_PROFILE: changeProfileInfo = {
  name: "",
  email: "",
  phone_number: "",
  birthday: "",
  address: "",
  avatar: "",
  cover_image: "",
};
