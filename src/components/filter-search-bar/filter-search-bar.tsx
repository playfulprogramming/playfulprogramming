import React from "react";
import styles from "./filter-search-bar.module.scss";
import { SearchField } from "./search-field";
import { FilterListbox } from "./filter-listbox";

export const FilterSearchBar: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return (
    <div className={styles.iconContainer}>
      <SearchField className={styles.searchField} />
      <div className={styles.midContainer}>{children}</div>
      <FilterListbox className={styles.filterField} />
    </div>
  );
};
