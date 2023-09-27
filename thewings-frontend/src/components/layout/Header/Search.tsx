import { IconButton, Stack } from "@mui/material";
import Input from "components/Input";
import { FormEvent, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const Search = () => {
  const [search, setSearch] = useState("");

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
        className="px-3 py-2 h-auto text-white w-[600px] border-white outline-none"
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
