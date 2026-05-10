import { useGetAllUserHistoryData } from "@/api/admin/HistoryApi";
import { useEffect, useState } from "react";

const ValidationCard = () => {
  const [allValidate, setAllValidate] = useState([]);
  const { data: historyData } = useGetAllUserHistoryData();

  useEffect(() => {
    if (historyData) setAllValidate(historyData)
  }, [historyData])

  console.log(allValidate)

  return <div>ValidationCard</div>;
};

export default ValidationCard;
