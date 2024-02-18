import { useAppDispatch, useAppSelector } from "stores/hooks";

import styles from "./index.module.css";
import { FaTimes } from "react-icons/fa";
import { closeTab, selectedTab } from "stores/files/filesSlice";

interface TabProps {
  tabName: string;
}

export default function SingleTab({ tabName }: TabProps) {
  const dispatch = useAppDispatch();

  const rootFoldername = useAppSelector((state) => state.files.rootFoldername);

  const dynamicStyle = {
    backgroundColor: rootFoldername === tabName ? "white" : "transparent",
    borderBottom: rootFoldername === tabName ? "1px solid white" : "none",
  };

  const handleClickTab = () => {
    dispatch(selectedTab({ tabName }));
  };

  const handleCloseTab = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(closeTab({ tabName }));
  };

  return (
    <div className={styles.tab} style={dynamicStyle} onClick={handleClickTab}>
      {tabName}
      <span onClick={handleCloseTab}>
        <FaTimes size={10} />
      </span>
    </div>
  );
}
