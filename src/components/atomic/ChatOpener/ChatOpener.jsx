import React from 'react';

const ChatOpener = () => {
  const handleChatSubmit = () => {
    window.open(
      'https://livehelp.cancer.gov/app/chat/chat_landing?_icf_22=2174',
      'Live_Assistance',
      'status=1,toolbar=0,menubar=0,location=0,resizable=1,height=750,width=660left=100,top=100'
    );
  };

  return (
    <button
      className="btnAsLink chat-link"
      type="button"
      onClick={handleChatSubmit}
    >
      chat online
    </button>
  );
};

export default ChatOpener;
