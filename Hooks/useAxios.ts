import axios from "axios";
import { useEffect, useState } from "react";

type axiosParams = {
  url: string;
  method: string;
  data: any;
  headers: any;
};

export const useAxios = (axiosParams: axiosParams) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async (params: axiosParams) => {
    try {
      const result = await axios.request(params);
      setResponse(result.data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(
    () => {
      fetchData(axiosParams);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return { response, error, loading };
};
