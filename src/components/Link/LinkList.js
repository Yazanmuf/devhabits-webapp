import React from "react";
import { FirebaseContext } from "../../firebase";
import LinkItem from './LinkItem'
// import useAuth from '../Auth/useAuth'

function LinkList(props) {
  const { firebase } = React.useContext(FirebaseContext)
  const [links, setLinks] = React.useState([])
  const isNewPage = props.location.pathname.includes("new")

  React.useEffect(() => {
    getLinks()
  }, [])

  function getLinks() {
    firebase.db.collection('links').orderBy('created', 'desc').onSnapshot(handleSnapshot)
  }

  function handleSnapshot(snapshot) {
    const links = snapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() }
    })
    setLinks(links)
  }

  function renderLinks() {
    if (isNewPage) {
      return links
    }
    // Use slice first for a shallow copy, then sort to make sure sort does't change the original links array
    const topLinks = links.slice().sort((l1, l2) => l2.votes.length - l1.votes.length);
    return topLinks
  }
  return (
    <div>
      {/* execute renderLinks function then map */}
      {renderLinks().map((link, index) => (
        <LinkItem
          key={link.id}
          showCount={true}
          link={link}
          index={index + 1}
        />
      ))}
    </div>
  );
}

export default LinkList;
