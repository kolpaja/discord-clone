import React from 'react';

type Props = {
  params: {
    channelId: string;
  };
};

const ChannelPage = ({ params: { channelId } }: Props) => {
  return <div>ChannelPage id: {channelId}</div>;
};

export default ChannelPage;
