export const prettyLog = (label, val, asTable, shouldWarn) => {
  console.log("%c" + label, "background-color: #245057; padding: 0.2rem 1.5rem;");
  if (shouldWarn) {
    console.warn(val);
  } else if (asTable) {
    console.table(val);
  } else console.log(val);
};
