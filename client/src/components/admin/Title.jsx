const Title = ({ title, subTitle }) => {
  return (
    <>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-blue-700">
        {title}
      </h1>
      <p className="text-xs sm:text-sm text-gray-600">{subTitle}</p>
    </>
  );
};

export default Title;
