import React from 'react';

type Props = {
  params: {
    id: string;
  };
};

const ConversationPage = ({ params: { id } }: Props) => {
  return <div>ConversationPage id: {id}</div>;
};

export default ConversationPage;
