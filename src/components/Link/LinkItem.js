import React from "react";
import { Link, withRouter } from 'react-router-dom'
import { getDomain } from '../../utils'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import { FirebaseContext } from "../../firebase";


function LinkItem({ link, index, showCount, history }) {

  const { firebase, user } = React.useContext(FirebaseContext)

  function handleVote() {
    if (!user) {
      history.push('/login')
    } else {
      const voteRef = firebase.db.collection('links').doc(link.id)
      voteRef.get().then(doc => {
        if (doc.exists) {
          const previousVotes = doc.data().votes;
          const vote = { votedBy: { id: user.uid, name: user.displayName } }
          const updatedVotes = [...previousVotes, vote]
          voteRef.update({ votes: updatedVotes })
        }
        // Add method here to limit to one vote per link
      })
    }
  }

  function handleDelete() {
    const linkRef = firebase.db.collection('links').doc(link.id);
    linkRef.delete().then(() => {
      console.log(`Document with ID ${link.id} deleted`)
    }).catch(err => {
      console.error('Error deleting document', err);
    })
  }
  const postedByAuthUser = (user && user.uid === link.postedBy.id);

  return (<div className="flex items-start mt2">
    <div className="flex items-center">
      {showCount && <span className='grey'>{index}.</span>}
      <div className="vote-button" onClick={handleVote}>
        ▲
      </div>
    </div>
    <div className='ml1 gray'>
      <div>
        {link.description}  <span className='grey' >({getDomain(link.resource)})</span>
      </div>
      <div className="f6 lh-copy gray">
        {link.votes.length} votes by {link.postedBy.name} {distanceInWordsToNow(link.created)}
        {" | "}
        <Link to={`/link/${link.id}`}>
          {link.comments.length > 0
            ? `${link.comment.length} comments`
            : "discus now"}
        </Link>
        {postedByAuthUser && (
          <>
            {" | "}
            <span className='delete-button' onClick={handleDelete}>
              delete
            </span>
          </>
        )}
      </div>
    </div>
  </div >)
}

export default withRouter(LinkItem);
