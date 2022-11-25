import { Input } from "./form/input";

const Search = () => {
  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          const formData = new FormData(event.currentTarget);
          console.log("search form submitted", formData.get("searchTerm"));
        }}
      >
        <Input name="searchTerm" label="Search for a stock" />
      </form>
    </>
  );
};

export default Search;
