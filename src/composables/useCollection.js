import { useContext, useState } from "react";
import AuthContext from "../context/auth-context";
import { projectFirestore } from "../firebase/firebase-config";

const useCollection = () => {
  const ctx = useContext(AuthContext);
  const userId = ctx.contextValue.userId;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(true);

  // GET user's saved movies and tvs collections
  const getSavedCollection = (collection) => {
    const userIdRef = projectFirestore.collection("users").doc(userId);

    userIdRef
      .collection(collection)
      .orderBy("createdAt")
      .onSnapshot(
        (snap) => {
          let docs = snap.docs.map((doc) => {
            return { ...doc.data() };
          });

          setData(docs);
          setError(null);
          setIsPending(false);
        },
        (err) => {
          console.log(err.message);
          setData(null);
          setError(
            "Could not fetch data, please referesh the page, or comeback later"
          );
        }
      );
  };

  // GET user's reviews collection on movies and tv shows
  const getReviewsCollection = (itemId) => {
    const userReviewRef = projectFirestore
      .collection("reviews")
      .doc(itemId)
      .collection("user-reviews");

    userReviewRef.orderBy("createdAt").onSnapshot(
      (snap) => {
        let docs = snap.docs.map((doc) => {
          return { ...doc.data() };
        });

        setData(docs);
        setError(null);
        setIsPending(false);
      },
      (err) => {
        console.log(err.message);
        setData(null);
        setError(
          "Could not fetch data, please referesh the page, or comeback later"
        );
      }
    );
  };

  return { getSavedCollection, getReviewsCollection, data, error, isPending };
};

export default useCollection;
