import { Avatar, IconButton, Stack, StackProps } from "@mui/material";
import Input, { InputProps } from "components/Input";
import { FormEvent, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { twMerge } from "tailwind-merge";
import { useMessage } from "store/message/selectors";
import { User } from "store/auth";
import { MouseEventHandler } from "react";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import { useRouter } from "next/router";
import useProfiles from "store/profile/selector";
import { usePost } from "store/post/selector";
type PropsSearch = {
  inputProps?: InputProps;
  onClick?: (user: User) => void;
} & StackProps;

const Search = (props: PropsSearch) => {
  const { inputProps, className, onClick, ...rest } = props;
  const [value, setValue] = useState("");
  const router = useRouter();
  const { onGetProfile } = useProfiles();
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  const { users, onSearchUser } = useMessage();
  const handleChange = async (event: FormEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
    const { value } = event.currentTarget;
    event.preventDefault();
    try {
      await onSearchUser(value);
    } catch (error) {
      console.log(error);
    }
  };
  const handleOpenProfile = async (username: string) => {
    try {
      await onGetProfile(username);
    } catch (error) {
      console.log(error);
    } finally {
      await router.push("/dashboard/orther_profile");
    }
  };

  return (
    <Stack>
      <Stack
        component="form"
        onSubmit={handleSubmit}
        direction="row"
        alignItems="center"
        justifyContent="center"
        className={twMerge("bg-gray-700 rounded-lg relative", className)}
        {...rest}
      >
        <Input
          className="w-[100%] h-[40px]"
          name="search"
          type="text"
          onChange={handleChange}
          placeholder="Search something..."
          {...inputProps}
        />
        <IconButton>
          <SearchIcon className="text-white" />
        </IconButton>
        {value ? (
          <Stack className="absolute top-[45px] w-full bg-slate-600 z-30 rounded-xl flex justify-center items-center max-h-[300px] overflow-y-auto space-y-2 p-2">
            {value &&
              users?.map((user) => (
                <Stack
                  key={user.id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  className="w-[98%] h-[40px] bg-slate-300 rounded-xl z-30 cursor-pointer hover:bg-slate-400 transition duration-300"
                >
                  <Stack
                    onClick={() => {
                      if (onClick) {
                        onClick(user);
                      } else {
                        handleOpenProfile(user.username)
                      }
                    }}
                    direction="row"
                    color="black"
                  >
                    {user.avatar ? (
                      <Avatar
                        src={"http://localhost:8000" + user.avatar}
                        alt={user.name}
                        sx={{ width: 32, height: 32 }}
                        className="mx-2"
                      />
                    ) : (
                      <Avatar sx={{ width: 32, height: 32 }} className="mx-2" />
                    )}
                    <Stack
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <span className="font-bold">{user.name}</span>
                        <span className="text-gray-400">@{user.username}</span>
                      </Stack>
                    </Stack>
                  </Stack>
                  <PermContactCalendarIcon
                    onClick={() => handleOpenProfile(user.username)}
                  />
                </Stack>
              ))}
          </Stack>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default Search;
