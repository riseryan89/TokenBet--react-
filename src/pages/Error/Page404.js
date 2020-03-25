import React from 'react';

function Page404({ location }) {
  return (
    <div>
      <h3>
        NOT FOUND <code>{location.pathname}</code>
      </h3>
    </div>
  );
}

export default Page404;