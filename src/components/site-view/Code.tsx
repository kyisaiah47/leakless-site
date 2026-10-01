import { Fragment } from 'react';

/* The README writes identifiers in backticks. This renders those spans as code and the rest as
 * text, so the copied sentence stays the README's own. */
export default function Code({ text }: { text: string }) {
  return (
    <>
      {text.split('`').map((part, i) => (i % 2 ? <code key={i}>{part}</code> : <Fragment key={i}>{part}</Fragment>))}
    </>
  );
}
