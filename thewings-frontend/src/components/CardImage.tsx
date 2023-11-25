

const CardImage = (props: { src: string }) => {
  const { src } = props;
  return (
    <img src={src} alt="preview" className="h-72 object-cover object-center" />
  );
}

export default CardImage;