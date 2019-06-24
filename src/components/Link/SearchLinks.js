import React from "react";
import LinkItem from "./LinkItem";
import FirebaseContext from "../../firebase/context";

function SearchLinks() {
  const { firebase } = React.useContext(FirebaseContext);
  const [filteredLinks, setFilteredLinks] = React.useState([]);
  const [links, setLinks] = React.useState([]);
  const [filter, setFilter] = React.useState("");

  React.useEffect(() => {
    getInitialLinks();
  }, []);

  function getInitialLinks() {
    firebase.db
      .collection("links")
      .get()
      .then(snapshot => {
        const links = snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() };
        });
        setLinks(links);
        console.log(links, "links")
      });
  }

  function handleSearch(event) {
    event.preventDefault();
    console.log(event.target.value, "event")
    console.log(links, "links")
    const query = filter.toLowerCase();
    const matchedLinks = links.filter((link) => {
      console.log(link)
      if (!link.description || !link.resource || !link.postedBy.name) { console.log("one or more of your fields") }
      return (
        // If any of these are of type Null. then it won't work. 
        link.description.toLowerCase().includes(query) ||
        link.resource.toLowerCase().includes(query) ||
        link.postedBy.name.toLowerCase().includes(query)
      );
    });
    setFilteredLinks(matchedLinks);
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          Search <input onChange={event => setFilter(event.target.value)} />
          <button>OK</button>
        </div>
      </form>
      {filteredLinks.map((filteredLink, index) => (
        <LinkItem
          key={filteredLink.id}
          showCount={false}
          link={filteredLink}
          index={index}
        />
      ))}
    </div>
  );
}

export default SearchLinks;
