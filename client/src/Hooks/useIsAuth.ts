import { useMeQuery } from "../generated/graphql";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const  useIsAuth = () => {
  const { data, loading } = useMeQuery();
  const router = useNavigate();
  useEffect(() => {
    if (!loading && !data?.me) {
      router("/login");
    }
  }, [loading, data, router]);
  return data
};
