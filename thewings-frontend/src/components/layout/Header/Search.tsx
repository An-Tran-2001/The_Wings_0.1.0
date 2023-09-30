import { Avatar, IconButton, Stack, StackProps } from "@mui/material";
import Input, { InputProps } from "components/Input";
import { FormEvent, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { twMerge } from "tailwind-merge";
import { useMessage } from "store/message/selectors";
import Image from "next/image";

type PropsSearch = {
  inputProps?: InputProps;
} & StackProps;

const Search = (props: PropsSearch) => {
  const { inputProps } = props;
  const { className, ...rest } = props;
  const [value, setValue] = useState("");
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

  return (
    <Stack>
      <Stack
        component="form"
        onSubmit={handleSubmit}
        direction="row"
        alignItems="center"
        justifyContent="center"
        className={twMerge("bg-gray-700 rounded-lg", className)}
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
      </Stack>
      <Stack padding={1} spacing={1}>
        {value && users?.map((user) => (
          <Stack
            key={user.id}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className="w-[100%] h-[40px] bg-slate-300 p-3 rounded-xl"
          >
            {user.avatar ? (
              <Avatar
                src={"http://localhost:8000" + user.avatar}
                alt={user.name}
                sx={{ width: 32, height: 32 }}
              />
            ) : (
              <Avatar sx={{ width: 32, height: 32 }} />
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
        ))}
      </Stack>
    </Stack>
  );
};

export default Search;
