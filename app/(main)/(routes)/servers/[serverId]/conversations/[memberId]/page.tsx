import React from 'react';

type Props = {
  params: {
    memberId: string;
  };
};

const ConversationPage = ({ params: { memberId } }: Props) => {
  return <div>ConversationPage memberId: {memberId}</div>;
};

export default ConversationPage;
