import { IconButton, Stack, StackProps } from "@mui/material";
import Input, { InputProps } from "components/Input";
import { FormEvent, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { twMerge } from "tailwind-merge";

type PropsSearch = {
  inputProps?: InputProps;
} & StackProps;

const Search = (props: PropsSearch) => {
  const { inputProps } = props;
  const [search, setSearch] = useState("");
  const { className, ...rest } = props;
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  return (
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
        value={search}
        onChange={handleChange}
        placeholder="Search something..."
        {...inputProps}
      />
      <IconButton>
        <SearchIcon className="text-white" />
      </IconButton>
    </Stack>
  );
};

export default Search;
