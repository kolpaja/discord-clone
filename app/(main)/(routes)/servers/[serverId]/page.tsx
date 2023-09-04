'use client';

import React from 'react';

type Props = {
  params: {
    serverId: string;
  };
};

const SingleServerPage = ({ params: { serverId } }: Props) => {
  return <div>SingleServerPage serverId : {serverId}</div>;
};

export default SingleServerPage;
