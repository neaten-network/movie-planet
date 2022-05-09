import { useState } from "react";

const useMultiFetch = () => {
  const [dataOne, setDataOne] = useState(null);
  const [dataTwo, setDataTwo] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const getMultiData = async (urls) => {
    try {
      const [result1, result2] = await Promise.all(
        urls.map((url) => fetch(url).then((res) => res.json()))
      );
      setDataOne(result1);
      setDataTwo(result2);
      setIsPending(false);
      setError(null);
      // console.log(result1);
      // console.log(result2);
    } catch {
      setIsPending(false);
      setError("Could not fetch the data for that resource");
    }
  };

  return { dataOne, dataTwo, getMultiData, isPending, error };
};

export default useMultiFetch;
