import { useAppSelector } from "stores/hooks";

import { TabData } from "types";
import styles from "./index.module.css";
import SingleTab from "./SingleTab";

export default function Tabs() {
  const tabsData = useAppSelector((state) => state.files.tabs);

  return (
    <div className={styles.container}>
      {tabsData.length > 0 &&
        tabsData.map((tab: TabData) => <SingleTab tabName={tab.name} key={tab.name} />)}
    </div>
  );
}
