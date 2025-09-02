const Card = ({ children, className = '', title, subtitle }) => {
  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg ${className}`}>
      {(title || subtitle) && (
        <div className="px-4 py-5 sm:p-6">
          {title && (
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 mb-4">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={title || subtitle ? 'px-4 pb-5 sm:px-6 sm:pb-6' : 'px-4 py-5 sm:p-6'}>
        {children}
      </div>
    </div>
  );
};

export default Card;
