import { IconButton, Stack } from "@mui/material";
import Input from "components/Input";
import { FormEvent, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

interface PropsSearch{
  className?: string;
  props?: any;
}

const Search = (props: PropsSearch) => {
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
      className="bg-gray-700 rounded-lg"
    >
      <Input
        className={className}
        name="search"
        type="text"
        value={search}
        onChange={handleChange}
        placeholder="Search something..."
      />
      <IconButton>
        <SearchIcon className="text-white" />
      </IconButton>
    </Stack>
  );
};

export default Search;
