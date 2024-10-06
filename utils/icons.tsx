export function CheckIcon(props: any) {
  const { isSelected, disableAnimation, ...otherProps } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...otherProps}
    >
      <path
        fill="#646262"
        fillRule="evenodd"
        d="M18.03 7.97a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06l3.47 3.47l6.47-6.47a.75.75 0 0 1 1.06 0"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
