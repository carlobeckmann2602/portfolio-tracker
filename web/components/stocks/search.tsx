import React, { useEffect, useState } from "react";
import { Input } from "../form/input";

export type SearchProps = {};

export const Search = ({}: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchDelay = 500;

  const handleSearchChange = (evt: Event) => {
    setSearchTerm((evt.target as HTMLTextAreaElement).value);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      console.log(searchTerm);
    }, searchDelay);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <Input
      handleChange={(evt: Event) => handleSearchChange(evt)}
      name="searchTerm"
      placeholder="Search for a stock"
    />
  );
};
