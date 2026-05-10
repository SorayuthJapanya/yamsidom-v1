
const Title = ({ title, subTitle }) => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-semibold text-blue-700">
        {title}
      </h1>
      <p className="text-gray-600">{subTitle}</p>
    </div>
  );
};

export default Title;
