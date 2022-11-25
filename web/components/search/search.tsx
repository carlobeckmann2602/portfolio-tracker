import React from "react";
import { Input } from "../form/input";

export type SearchProps = {};

export const Search = ({}: SearchProps) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        console.log("search form submitted", formData.get("searchTerm"));
      }}
    >
      <Input name="searchTerm" label="Search for a stock" />
    </form>
  );
};
