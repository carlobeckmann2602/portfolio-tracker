const Search = () => {
  return (
    <>
      <h1>Search</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          const formData = new FormData(event.currentTarget);
          console.log("search form submitted", formData.get("searchTerm"));
        }}
      >
        <label htmlFor="searchTerm">Stock Name</label>
        <input type="text" id="searchTerm" name="searchTerm" />
      </form>
    </>
  );
};

export default Search;
