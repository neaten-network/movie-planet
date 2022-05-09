import { useState } from "react";

const useFetch = () => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw Error("Could not fetch the data for that resource");
      }
      const data = await response.json();
      setData(data);
      setIsPending(false);
      setError(null);
      // console.log(data);
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        setIsPending(false);
        setError(err.message);
      }
    }
  };

  return { data, fetchData, isPending, error };
};

export default useFetch;
