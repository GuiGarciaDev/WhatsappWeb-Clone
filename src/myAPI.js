

export function deleteMessage() {
    console.log(message);
    console.log(friend.messages);
    friend.messages.splice(message, 1);
    console.log(friend.messages);
    
    for (let i = 0; i < friend.messages.length; i++) {
        friend.messages[i].id = "m"+i;
    }
  }