const HamburgerIcon = (props) => {
  return (
    <svg className={props.class} viewBox="0 0 90 80" width={props.width ? props.width : 200} height={props.height ? props.height : 48}>
      <rect width="100" height="20"></rect>
      <rect y="30" width="100" height="20"></rect>
      <rect y="60" width="100" height="20"></rect>
    </svg>
  );
};

export default HamburgerIcon;